import * as vscode from 'vscode';
import CardView from './components/CardView';
import PileCounterView from './components/PileCounterView';
import { Config } from './state/config';
import { Card, Deck, DeckPosition } from './deck/deck';
import { WorkspaceState } from './state/workspace-state';
import IconView from './components/IconView';

export class CardViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'zvRandomCards.cardView';
    private _view?: vscode.WebviewView;
    private _lastDraw?: Date;
    private _nextDrawInterval?: NodeJS.Timer;
    private _currentCard?: Card;

    constructor(private readonly _config: Config, private readonly _state: WorkspaceState, private readonly _extensionUri: vscode.Uri, private _deck: Deck) {
        this._nextDrawInterval = setInterval(async () => {
            if (!this._state.getNextDraw() || new Date() <= (this._state.getNextDraw() || 0)) {
                return;
            }

            if (this._view && !this._view.visible && this._config.isBadgeNotificationEnabled) {
                this._view.badge = {
                    tooltip: 'New card !',
                    value: 1
                };
            }

            if (this._config.isNotificationEnabled) {
                vscode.window.showInformationMessage(`You have a new card ! (${new Date().toLocaleTimeString()})`);
            }

            await this.drawCard();
        }, 5000);
    }

    public set deck(deck: Deck) {
        this._deck = deck;
    }

    public get deck(): Deck {
        return this._deck;
    }

    public get currentCard(): Card | undefined {
        return this._currentCard;
    }

    public get lastDraw(): Date | undefined {
        return this._lastDraw;
    }

    public async drawCard(): Promise<Card> {
        this._deck.build().shuffle();
        this._currentCard = this._deck.draw(DeckPosition.top, 1)[0];
        this._lastDraw = new Date();

        if (this._config.pickEvery > 0) {
            await this._state.setNextDraw(new Date(this._lastDraw.getTime() + (this._config.pickEvery * 1000)));
        } else {
            await this._state.setNextDraw(null);
        }

        if (this._config.pileUp) {
            const pile = [...this._state.getCardPile()];
            pile.push(this._currentCard);
            await this._state.setCardPile(pile);
        } else {
            await this._state.setCardPile([]);
        }

        this._updateView();

        return this._currentCard;
    }

    public async acknowledge(all?: boolean) {
        if (all) {
            this._state.setCardPile([]);
            this._currentCard = undefined;
            this._updateView();
            return;
        }

        const pile = this._state.getCardPile();
        pile.pop();
        this._currentCard = pile[pile.length - 1];
        this._state.setCardPile(pile);

        this._updateView();
    }

    public resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        };

        this._view.onDidChangeVisibility(() => {
            if (this._view) {
                this._view.badge = { tooltip: '', value: 0 };
            }
        }, this);

        const pile = this._state.getCardPile();
        if (pile.length > 0) {
            this.acknowledge();
        }

        this._updateView();
    }

    public dispose() {
        clearInterval(this._nextDrawInterval);
    }

    private _updateView() {
        if (!this._view) {
            return;
        }

        this._view.webview.html = this._getHtml(this._view.webview);
    }


    private _getHtml(webview: vscode.Webview) {
        const styles = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'assets', 'styles.css'));
        const codiconsUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'node_modules', '@vscode/codicons', 'dist', 'codicon.css'));
        const { aggregatePile, useWeight } = this._config;
        const pile = this._state.getCardPile();

        return `
        <!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">

                <link href="${styles}" rel="stylesheet">
				<link href="${codiconsUri}" rel="stylesheet" />
				<title>Card view</title>
			</head>
			<body>
            <div class="container">
            ${!this._state.getNextDraw() && !this._currentCard ?
                `Get started by drawing a card!` : ''
            }

            ${this._currentCard ? `
                ${new CardView({ aggregatePile, useWeight, currentCard: this._currentCard, pile }).renderHtml()}
                ${new PileCounterView({ pile }).renderHtml()}
                ${this._lastDraw ? `
                <div class="info-text">
                    <div>Last card picked at:</div>
                    <div>${this._lastDraw?.toLocaleString()}</div>
                </div>
                ` : ''}
                ` : ''
            }

            ${this._state.getNextDraw() ? `
                <div class="info-text">
                    <div>Next card will be picked at:</div>
                    <div>${this._state.getNextDraw()?.toLocaleString()}</div>
                </div>
                `: ''
            }
            </div>
			</body>
		</html>`;
    }
}
