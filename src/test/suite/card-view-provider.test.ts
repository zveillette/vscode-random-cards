import * as assert from 'assert';
import * as vscode from 'vscode';
import { CardViewProvider } from '../../card-view-provider';
import { Deck } from '../../deck/deck';
import { DeckType } from '../../deck/deck-type';
import { Config } from '../../state/config';
import { WorkspaceState } from '../../state/workspace-state';
import { buildWebViewMock } from '../mock/webview-view.mock';
import { WorkspaceStateMock } from '../mock/workspace-state.mock';

describe('CardViewProvider', () => {
    const customDeckA = new DeckType('CustomDeckA',
        [
            { name: 'CardA', points: 1 },
            { name: 'CardB', points: 2 }
        ],
        [
            { name: 'TypeA' },
            { name: 'TypeB', weight: 2 }
        ]
    );

    const customDeckB = new DeckType('CustomDeckB',
        [
            { name: 'CardAA', points: 1 }
        ],
        [
            { name: 'TypeAA' }
        ]
    );

    const resolveContext: vscode.WebviewViewResolveContext = {} as vscode.WebviewViewResolveContext;
    const cancellationToken: vscode.CancellationToken = {} as vscode.CancellationToken;

    let context: vscode.ExtensionContext;
    let config: Config;
    let state: WorkspaceStateMock;
    let deck: Deck;
    let webView: vscode.WebviewView;
    before(async () => {
        context = await vscode.extensions.getExtension('zveillette.zv-random-cards')?.activate();
        state = new WorkspaceStateMock();
        deck = new Deck(customDeckA);
        config = new Config();
    });

    beforeEach(async () => {
        await config.reset();
        webView = buildWebViewMock();
    });

    it('Create view provider', async () => {
        const provider = new CardViewProvider(config, state as any, context.extensionUri, deck);
        assert.doesNotThrow(() => provider.resolveWebviewView(webView, resolveContext, cancellationToken));
    });

    it('Draw a card', async () => {
        const provider = new CardViewProvider(config, state as any, context.extensionUri, deck);
        provider.resolveWebviewView(webView, resolveContext, cancellationToken);

        await provider.drawCard();
        const cardName = provider.currentCard?.name;
        assert.ok(cardName, 'No card was drawn');
        assert.strictEqual(customDeckA.cards.map((card) => card.name).includes(cardName), true, 'Card doesn\'t match deck');
    });

    it('Draw a card and add to the pile', async () => {
        await config.setPileUp(true);

        const provider = new CardViewProvider(config, state as any, context.extensionUri, deck);
        provider.resolveWebviewView(webView, resolveContext, cancellationToken);

        await provider.drawCard();
        assert.ok(provider.currentCard, 'No card was drawn');

        const pile = state.getCardPile();
        assert.equal(pile.length, 1, 'Card wasn\'t added to pile');
        assert.equal(pile[0].name, provider.currentCard.name, 'Card wasn\'t added to pile');
    });

    it('Draw multiple cards and add them to the pile', async () => {
        await config.setPileUp(true);

        const provider = new CardViewProvider(config, state as any, context.extensionUri, deck);
        provider.resolveWebviewView(webView, resolveContext, cancellationToken);

        await provider.drawCard();
        await provider.drawCard();
        await provider.drawCard();

        const pile = state.getCardPile();
        const lastCardName = provider?.currentCard?.name;
        assert.equal(pile.length, 3, 'Card wasn\'t added to pile');
        assert.equal(pile[2].name, lastCardName, 'Card wasn\'t added to pile');
    });

    it('Update deck', async () => {
        const provider = new CardViewProvider(config, state as any, context.extensionUri, deck);
        provider.resolveWebviewView(webView, resolveContext, cancellationToken);
        provider.deck = new Deck(customDeckB);

        assert.equal(provider.deck.deckType.name, customDeckB.name, 'Deck wasn\'t updated');

        await provider.drawCard();
        assert.equal(provider.currentCard?.name, customDeckB.cards[0].name, 'Deck wasn\'t updated. Wrong card was picked');
    });

    it('Acknowledge card and remove from pile', async () => {
        await config.setPileUp(true);

        const provider = new CardViewProvider(config, state as any, context.extensionUri, deck);
        provider.resolveWebviewView(webView, resolveContext, cancellationToken);

        await provider.drawCard();
        assert.equal(state.getCardPile().length, 1, 'Card wasn\'t added to pile');

        await provider.acknowledge();
        assert.equal(state.getCardPile().length, 0, 'Card wasn\'t removed from pile');
        assert.equal(typeof provider.currentCard, 'undefined', 'There shouldn\'t be a current card');
    });

    it('Acknowledge multiple cards and remove them from the pile', async () => {
        await config.setPileUp(true);

        const provider = new CardViewProvider(config, state as any, context.extensionUri, deck);
        provider.resolveWebviewView(webView, resolveContext, cancellationToken);

        const firstCard = await provider.drawCard();

        // Switch deck so we uniquely identify first card
        provider.deck = new Deck(customDeckB);
        
        await provider.drawCard();
        await provider.drawCard();
        assert.equal(state.getCardPile().length, 3, 'Card wasn\'t added to pile');

        await provider.acknowledge();
        await provider.acknowledge();
        assert.equal(state.getCardPile().length, 1, 'Card wasn\'t removed from pile');
        assert.equal(provider.currentCard, firstCard, 'Current card should be first card drawn');
    });

    it('Reset pile (acknowledge all)', async () => {
        await config.setPileUp(true);

        const provider = new CardViewProvider(config, state as any, context.extensionUri, deck);
        provider.resolveWebviewView(webView, resolveContext, cancellationToken);

        await provider.drawCard();
        await provider.drawCard();
        await provider.drawCard();
        assert.equal(state.getCardPile().length, 3, 'Card wasn\'t added to pile');
        
        await provider.acknowledge(true);
        assert.equal(state.getCardPile().length, 0, 'Pile should be empty');
        assert.equal(typeof provider.currentCard, 'undefined', 'There shouldn\'t be a current card');
    });
});
