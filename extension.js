// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');
var fs = require('fs');
var path = require('path');

const MSG_NO_REPEATED_TOKENS = "there were substrings that were present in all lines of the selection. For alignment to work, make sure each line has a repeated string";
// const MSG_NO_STANDARD_TOKENS = "there were no `:` or `=` characters found in every line of the selection.";

class AlignmentToken {
  /**
   * Basic structure to store references to alignment tokens
   * @param {*} string the string that designates the token
   * @param {*} positions an array of integers which represent the indexes at which the token occurs in each line of the selection
   */
  constructor(string, positions) {
    this.string = string;
    this.positions = positions;
    this.lowestIndex = Math.min(...positions);
    this.highestIndex = Math.max(...positions);

    this.setPositions = this.setPositions.bind(this);
  }

  setPositions(positions) {
    this.positions = positions;
    this.lowestIndex = Math.min(...positions);
    this.highestIndex = Math.max(...positions);
  }
}

/**
 * 
 * @param {*} string 
 * @param {*} originalPosition the position the token is currently in the string
 * @param {*} finalPosition the position the token should be plae
 */
function alignToken(string, originalPosition, finalPosition) {
  const front = string.slice(0, originalPosition);
  const back = string.slice(originalPosition);
  const spaces = " ".repeat(finalPosition - originalPosition);
  return front + spaces + back;
}

/**
 * 
 * @param {*} text 
 * @param {AlignmentToken} token 
 * @return {Array} positions
 */
function calculateIndices(text, token) {
  return text.map(line => line.indexOf(token))
}

/**
 * 
 * @param {Array<AlignmentToken>} tokenContainer
 * @param {Array<String>} searchTerms terms to search for
 * @param {Array<String>} lines strings to be searched
 */
function addTokens(tokenContainer, searchTerms, lines) {
  searchTerms.forEach(term => {
    if (lines.every(line => line.includes(term))) {
      tokenContainer.push(new AlignmentToken(
        term,
        calculateIndices(lines, term)
      ));
    }
  });
}



// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
  var disposable = vscode.commands.registerCommand(
    'extension.align',
    function() {
      var activeEditor = vscode.window.activeTextEditor;
      var activeDoc = activeEditor.document;
      // always start at beginning of line - omitting whitespace messes up the indicies used for alignment
      var start = activeEditor.selection.isEmpty ? new vscode.Position(0, 0) : new vscode.Position(activeEditor.selection.start.line, 0);
      var end = activeEditor.selection.isEmpty ? new vscode.Position(activeDoc.lineCount + 1, 0) : activeEditor.selection.end;
      var activeDocText = activeDoc.getText(new vscode.Range(start, end));

      /*
      Algorithm overview
      ==================
      1. Look in doc text
      2. create empty array to store references to "alignment tokens" (any substring that requires alignment)
      2. find any instances of chars that indicate aligning needs (:, =)
      3. find any words that are repeated in all lines of the selection
        1. split line 1 on spaces (maybe remove "ALWAYS_TOKENS" from the string first?)
        2. for each word, see if that word occurs in all other lines
        3. if yes, add that word to the alignmentTokens array
        4. if you get to the end and there are no repeated tokens - no need to check the other lines
      4. order the array of tokens based on which token occurs earliest in the lines
      5. loop through the array. For each item,
        5.1. loop through the lines.
        5.2. find the largest index of non-whitespace character that occurs directly before the token
        5.3. add spaces to each line to make them equal that position for each line
      */

      // define tokens that you always want to search for but will not be found by splitting on "word"
      const ALWAYS_TOKENS = [":", "="];
      let alignmentTokens = [];
      let finalText;

      try {
        finalText = activeDocText.split(/\n/)

        // get repeated words: split first line into words and remove any values that are empty strings
        const words = finalText[0].split(/[=:\s\t]/).filter(l => l !== '');
        
        // find and add tokens to the alignmentTokens list
        addTokens(alignmentTokens, ALWAYS_TOKENS, finalText);

        // find and add repeated words to the alignmentTokens list
        addTokens(alignmentTokens, words, finalText);

        // sort tokens by lowestIndex so it processes from beginning of string to end
        alignmentTokens.sort((a, b) => {
          if (a.lowestIndex > b.lowestIndex) return 1
          else if (a.lowestIndex < b.lowestIndex) return -1
          else return 0
        })

        console.log('about to log alignmentTokens');
        console.log(alignmentTokens);

        // align text
        alignmentTokens.forEach(token => {
          // recalculate token positions each time so that any adjustments
          // since the indices may no longer be correct after aligning the previous token.
          token.setPositions(calculateIndices(finalText, token.string));
          finalText = finalText.map((line, i) => {
            return alignToken(line, token.positions[i], token.highestIndex);
          });
        })

        // join array of lines into string that can be inserted into the document
        finalText = finalText.join('\n');
      } catch (e) {
        console.error('error, try 1', e);
      }

      try {
        return activeEditor.edit(editorEdit => {
          editorEdit.delete(new vscode.Range(start, end))
          editorEdit.replace(start, finalText);
        });
      } catch (e) {
        console.error('error, try 2', e);
      }
    }
  );
  context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}
exports.deactivate = deactivate;
