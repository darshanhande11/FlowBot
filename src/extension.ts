// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios from 'axios';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "flow-bot" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('flow-bot.ask', async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Ask anything related to Flow!');
		const queryBox = await vscode.window.showInputBox();
		let res;
		let userQuery :string;
		userQuery = queryBox || '';
		if(userQuery == '') {
			vscode.window.showWarningMessage('Please enter a non empty query!');
			return ;
		}
		await vscode.window.withProgress({
			location: vscode.ProgressLocation.Notification,
			cancellable: false,
			title: "Flow Bot is thinking...",
		}, async(progress) => {
			progress.report({increment: 0});
			res = await axios.get("https://flow-gpt-server.onrender.com/ask", {
				params: {
					"query": userQuery
				}
			});
			progress.report({ increment: 100 });
		});

		const answer = res!.data.ans || 'Sorry, I could not find an answer to your query!';
		const panel = vscode.window.createWebviewPanel(
			'flowBot', // Unique identifier
			'Flow-Bot', // Title displayed in the UI
			vscode.ViewColumn.One, // Desired column to show the panel
			{
				// Enable scripts in the webview
				enableScripts: true
			}
		);

		// Set the HTML content for the webview
		panel.webview.html = getWebviewContent(userQuery!, answer);

		// const answer = vscode.window.showInformationMessage('Hey there some random text!!!');




	});

	context.subscriptions.push(disposable);
}

const getWebviewContent = (question: string, answer: string) => {
	return `
		<html>
		<body>
			<h2>${question}</h2>
			<pre>${answer}</pre>
		</body>
		</html>
	`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
