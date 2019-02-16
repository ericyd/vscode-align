// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
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
      : activeDoc.lineAt(activeEditor.selection.end.line).range.end;
    var activeDocText = activeDoc.getText(new vscode.Range(start, end));

    vscode.window
      .showInputBox({ prompt: 'Enter the string to align on' })
      .then(token => {
        if (!token) return;
        console.log(token);

        let lines: Lines = new Lines(activeDocText.split(EOL), token);
        lines.align();
        let joinedText = lines.join(EOL);

        return (
          activeEditor &&
          activeEditor.edit(editorEdit => {
            editorEdit.delete(new vscode.Range(start, end));
            editorEdit.replace(start, joinedText);
          })
        );
      })
      .catch(console.log.bind(console));
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
