import * as vscode from 'vscode';
import { CardViewProvider } from './card-view-provider';
import { Config, ConfigKeys, CONFIG_NAME } from './config';
import { Deck } from './deck';
import { DeckType } from './deck-type';
import { WorkspaceState } from './workspace-state';

export function activate(context: vscode.ExtensionContext) {
	const deckTypes = {
		standard: new DeckType().build(
			'Standard',
			[
				{ name: 'Ace', points: 11 },
				{ name: '2', points: 2 },
				{ name: '3', points: 3 },
				{ name: '4', points: 4 },
				{ name: '5', points: 5 },
				{ name: '6', points: 6 },
				{ name: '7', points: 7 },
				{ name: '8', points: 8 },
				{ name: '9', points: 9 },
				{ name: '10', points: 10 },
				{ name: 'Jack', points: 10 },
				{ name: 'Queen', points: 10 },
				{ name: 'King', points: 10 },
			],
			[{ name: 'Clubs' }, { name: 'Diamonds' }, { name: 'Hearts' }, { name: 'Spades' }]
		),
		training: new DeckType().build(
			'Training',
			[
				{ name: 'Ace', points: 11 },
				{ name: '2', points: 2 },
				{ name: '3', points: 3 },
				{ name: '4', points: 4 },
				{ name: '5', points: 5 },
				{ name: '6', points: 6 },
				{ name: '7', points: 7 },
				{ name: '8', points: 8 },
				{ name: '9', points: 9 },
				{ name: '10', points: 10 },
				{ name: 'Jack', points: 10 },
				{ name: 'Queen', points: 10 },
				{ name: 'King', points: 10 },
			],
			[
				{ name: 'Jumping Jacks', weight: 2 },
				{ name: 'Sit-ups', weight: 2 },
				{ name: 'Squats', weight: 1.5 },
				{ name: 'Push-ups', weight: 1 },
			]
		)
	} as { [name: string]: DeckType };

	let deckType = Config.deckType;
	if (!deckType) {
		vscode.window.showWarningMessage(`Invalid deck type ${Config.deckType}`);
		deckType = 'standard';
	}

	const state = new WorkspaceState(context);
	const deck = new Deck(deckTypes[deckType]);
	const provider = new CardViewProvider(state, context.extensionUri, deck);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(CardViewProvider.viewType, provider),
		new vscode.Disposable(() => provider.dispose()),
		vscode.commands.registerCommand('zvRandomCards.draw', async () => {
			await provider.drawCard();
		}),
		vscode.commands.registerCommand('zvRandomCards.acknowledge', async () => {
			if(Config.aggregatePile) {
				await provider.acknowledge(true);
				return;
			}

			await provider.acknowledge();
		}),
		vscode.commands.registerCommand('zvRandomCards.resetPile', async () => {
			await provider.acknowledge(true);
		}),
		vscode.workspace.onDidChangeConfiguration((e) => {
			if (!e.affectsConfiguration(`${CONFIG_NAME}.${ConfigKeys.deckType}`)) {
				return;
			}

			if (!deckTypes[Config.deckType]) {
				vscode.window.showWarningMessage(`Invalid deck type ${Config.deckType}`);
			}

			deck.deckType = deckTypes[Config.deckType];
		})
	);

}

export function deactivate() { }
