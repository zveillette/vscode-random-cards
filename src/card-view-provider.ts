import * as vscode from 'vscode';
import { Config } from './config';
import { Card, Deck, DeckPosition } from './deck';

export class CardViewProvider implements vscode.WebviewViewProvider {

    public static readonly viewType = 'zvRandomCards.cardView';
    private _view?: vscode.WebviewView;
    private _lastDraw?: Date;
    private _nextDrawInterval?: NodeJS.Timer;
    private _currentCard?: Card;

    constructor(private readonly _extensionUri: vscode.Uri, private _deck: Deck) {
        this._nextDrawInterval = setInterval(async () => {
            if (!Config.nextDraw || new Date() <= Config.nextDraw) {
                return;
            }

            if (this._view && !this._view.visible && Config.isBadgeNotificationEnabled) {
                this._view.badge = {
                    tooltip: 'New card !',
                    value: 1
                };
            }
            
            if (Config.isNotificationEnabled) {
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

        if (Config.pickEvery > 0) {
            await Config.setNextDraw(new Date(this._lastDraw.getTime() + (Config.pickEvery * 1000)));
        } else {
            await Config.setNextDraw(null);
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
            ${!Config.nextDraw && !this._currentCard ?
                `Get started by drawing a card!` : ''
            }

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
                ` : ''
            }

            ${Config.nextDraw ? `
                <div class="info-text">
                    <div>Next card will be picked at:</div>
                    <div>${Config.nextDraw?.toLocaleString()}</div>
                </div>
                `: ''
            }
            </div>
			</body>
		</html>`;
    }
}
