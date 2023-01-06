import * as vscode from 'vscode';
import { CardViewProvider } from './card-view-provider';
import { Deck, DECK_TYPES } from './deck';

export function activate(context: vscode.ExtensionContext) {
	const deck = new Deck(DECK_TYPES.standard);
	const provider = new CardViewProvider(context.extensionUri, deck);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(CardViewProvider.viewType, provider),
		new vscode.Disposable(() => provider.dispose()),
		vscode.commands.registerCommand('zvRandomCards.draw', () => {
			provider.drawCard();
		})
	);

}

export function deactivate() {

}
