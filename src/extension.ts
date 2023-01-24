import * as vscode from 'vscode';
import { CardViewProvider } from './card-view-provider';
import { Config, ConfigKeys, CONFIG_NAME } from './state/config';
import { Deck } from './deck/deck';
import { WorkspaceState } from './state/workspace-state';
import { getDeckTypes } from './deck/deck-types';

const DEFAULT_DECK = 'standard';

export function activate(context: vscode.ExtensionContext) {
    const config = new Config();
    const state = new WorkspaceState(context);

    let deckTypes = getDeckTypes(config);
    let deckType = config.deckType;
    if (!deckTypes[deckType]) {
        deckType = DEFAULT_DECK;
    }
    const deck = new Deck(deckTypes[deckType]);
    const provider = new CardViewProvider(config, state, context.extensionUri, deck);

    const onDeckTypeChange = () => {
        deckTypes = getDeckTypes(config);

        if (!deckTypes[config.deckType]) {
            vscode.window.showWarningMessage(`Invalid deck type ${config.deckType}`);
        }

        deck.deckType = deckTypes[config.deckType];
    };

    const onCustomDecksChange = () => {
        deckTypes = getDeckTypes(config);
    };

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(CardViewProvider.viewType, provider),
        new vscode.Disposable(() => provider.dispose()),
        vscode.commands.registerCommand('zvRandomCards.draw', async () => {
            await provider.drawCard();
        }),
        vscode.commands.registerCommand('zvRandomCards.acknowledge', async () => {
            if (config.aggregatePile) {
                await provider.acknowledge(true);
                return;
            }

            await provider.acknowledge();
        }),
        vscode.commands.registerCommand('zvRandomCards.resetPile', async () => {
            await provider.acknowledge(true);
        }),
        vscode.workspace.onDidChangeConfiguration(async (e) => {
            if (e.affectsConfiguration(`${CONFIG_NAME}.${ConfigKeys.aggregatePile}`)) {
                await config.setAggregatePile(config.aggregatePile);
                return;
            }

            if (e.affectsConfiguration(`${CONFIG_NAME}.${ConfigKeys.pileUp}`)) {
                await config.setPileUp(config.pileUp);
                return;
            }

            if (e.affectsConfiguration(`${CONFIG_NAME}.${ConfigKeys.deckType}`)) {
                onDeckTypeChange();
                return;
            }

            if (e.affectsConfiguration(`${CONFIG_NAME}.${ConfigKeys.customDecks}`)) {
                onCustomDecksChange();
                return;
            }
        })
    );
}

export function deactivate() { }
