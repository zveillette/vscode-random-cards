import { window, commands, ExtensionContext } from 'vscode';

export function activate(context: ExtensionContext) {
	let disposable = commands.registerCommand('zv-random-cards.helloWorld', () => {
		window.showInformationMessage('Hello World from zv-random-cards!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
