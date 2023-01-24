import * as vscode from 'vscode';
import CardView from './components/CardView';
import { Config } from './state/config';
import { Card, Deck, DeckPosition } from './deck/deck';
import { WorkspaceState } from './state/workspace-state';

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

    public async drawCard() {
        this._deck.build().shuffle();
        this._currentCard = this._deck.draw(DeckPosition.top, 1)[0];
        this._lastDraw = new Date();

        if (this._config.pickEvery > 0) {
            await this._state.setNextDraw(new Date(this._lastDraw.getTime() + (this._config.pickEvery * 1000)));
        } else {
            await this._state.setNextDraw(null);
        }

        if (this._config.pileUp) {
            const pile = this._state.getCardPile();
            pile.push(this._currentCard);
            this._state.setCardPile(pile);
        } else {
            this._state.setCardPile([]);
        }

        this._updateView();
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
        const { aggregatePile, difficultyLevel, useWeight } = this._config;

        return `
        <!DOCTYPE html>
		<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">

                <link href="${styles}" rel="stylesheet">
				<title>Card view</title>
			</head>
			<body>
            <div class="container">
            ${!this._state.getNextDraw() && !this._currentCard ?
                `Get started by drawing a card!` : ''
            }

            ${this._currentCard ? `
                <div class="card-container">
                    ${new CardView({ aggregatePile, difficultyLevel, useWeight, currentCard: this._currentCard, pile: this._state.getCardPile() }).renderHtml()}
                </div>
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

            ${this._state.getCardPile().length > 0 ? `
                <div class="info-text">
                    <div>Pile:</div>
                    <div>${this._state.getCardPile().length}</div>
                </div>
                `: ''
            }
            </div>
			</body>
		</html>`;
    }
}
