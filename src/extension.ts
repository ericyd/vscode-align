// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {
  addTokens,
  AlignmentToken,
  calculateIndices,
  alignToken
} from './alignmentToken2';
import { EOL } from 'os';
import Lines from './lines';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('extension.align', () => {
    // The code you place here will be executed every time your command is executed
    var activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) return;

    var activeDoc = activeEditor.document;
    // always start at beginning of line - omitting whitespace messes up the indicies used for alignment
    var start = activeEditor.selection.isEmpty
      ? new vscode.Position(0, 0)
      : new vscode.Position(activeEditor.selection.start.line, 0);
    var end = activeEditor.selection.isEmpty
      ? new vscode.Position(activeDoc.lineCount + 1, 0)
      : activeEditor.selection.end;
    var activeDocText = activeDoc.getText(new vscode.Range(start, end));

    let token = vscode.window
      .showInputBox({ prompt: 'Enter the string to align on' })
      .then(token => {
        if (!token) return;
        console.log(token);

        let lines: Lines = new Lines(activeDocText.split(EOL), token);
        lines.align();
        let joinedText = lines.join(EOL);
      });

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
    const ALWAYS_TOKENS = [':', '='];
    let alignmentTokens: AlignmentToken[] = [];
    let finalText: string[];
    let finalTextJoined: string;

    // try {
    //   finalText = activeDocText.split(EOL)

    //   // get repeated words: split first line into words and remove any values that are empty strings
    //   const words = finalText[0].split(/[=:\s\t]/).filter(l => l !== '');

    //   // find and add tokens to the alignmentTokens list
    //   addTokens(alignmentTokens, ALWAYS_TOKENS, finalText);

    //   // find and add repeated words to the alignmentTokens list
    //   addTokens(alignmentTokens, words, finalText);

    //   // sort tokens by lowestIndex so it processes from beginning of string to end
    //   alignmentTokens.sort((a, b) => {
    //     if (a.lowestIndex > b.lowestIndex) return 1
    //     else if (a.lowestIndex < b.lowestIndex) return -1
    //     else return 0
    //   })

    //   console.log('about to log alignmentTokens');
    //   console.log(alignmentTokens);

    //   // align text
    //   alignmentTokens.forEach(token => {
    //     // recalculate token positions each time so that any adjustments
    //     // since the indices may no longer be correct after aligning the previous token.
    //     token.setPositions(calculateIndices(finalText, token.string));
    //     finalText = finalText.map((line, i) => {
    //       return alignToken(line, token.positions[i], token.highestIndex);
    //     });
    //   })

    //   // join array of lines into string that can be inserted into the document
    //   finalTextJoined = finalText.join('\n');
    // } catch (e) {
    //   console.error('error, try 1', e);
    // }

    try {
      return activeEditor.edit(editorEdit => {
        editorEdit.delete(new vscode.Range(start, end));
        editorEdit.replace(start, finalTextJoined);
      });
    } catch (e) {
      console.error('error, try 2', e);
    }
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
