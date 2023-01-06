import * as vscode from 'vscode';
import { Config } from './config';
import { Card, Deck, DeckPosition, DECK_TYPES } from './deck';

export class CardViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'zvRandomCards.cardView';
    private _view?: vscode.WebviewView;
    private _lastDraw?: Date;
    private _nextDraw?: Date;
    private _nextDrawInterval?: NodeJS.Timer;
    private _currentCard?: Card;

    constructor(private readonly _extensionUri: vscode.Uri, private _deck: Deck) {
        this._nextDrawInterval = setInterval(() => {
            if (!this._nextDraw || new Date() <= this._nextDraw) {
                return;
            }

            if (this._view && !this._view.visible && Config.isBadgeNotificationEnabled) {
                this._view.badge = {
                    tooltip: 'New card !',
                    value: 1
                };
            }

            this.drawCard();
        }, 5000);
    }

    public set deck(deck: Deck) {
        this._deck = deck;
    }

    public drawCard() {
        this._deck.build(DECK_TYPES.standard).shuffle();
        this._currentCard = this._deck.draw(DeckPosition.top, 1)[0];
        this._lastDraw = new Date();

        if (Config.pickEvery > 0) {
            this._nextDraw = new Date(this._lastDraw.getTime() + (Config.pickEvery * 1000));
        }

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
            ${this._currentCard ? `

                <div class="card">
                    <div class="card-title">
                    ${this._currentCard.cardType?.name}: ${this._currentCard.name}
                    </div>
                </div>
                <div class="info-text">
                    <div>Last card picked at:</div>
                    <div>${this._lastDraw?.toLocaleString()}</div>
                </div>

                ${this._nextDraw ? `
                    <div class="info-text">
                        <div>Next card will be picked at:</div>
                        <div>${this._nextDraw?.toLocaleString()}</div>
                    </div>
                    ` : ``

                }
                

                ` :
                `Get started by drawing a card !`

            }
                
            </div>
			</body>
		</html>`;
    }
}
