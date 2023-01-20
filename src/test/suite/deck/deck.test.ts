import * as assert from 'assert';
import { CardType, Deck, DeckPosition } from '../../../deck/deck';
import { DeckError, DeckErrorType } from '../../../deck/deck-error';
import { DeckType } from '../../../deck/deck-type';

suite('Deck', () => {
    let deckOneCardOneType = new DeckType('DeckOneCardOneType',
        [
            { name: 'CardA', points: 1 }
        ],
        [
            { name: 'TypeA' }
        ]
    );

    let deckTwoCardsTwoTypes = new DeckType('DeckOneCardOneType',
        [
            { name: 'CardA', points: 1 },
            { name: 'CardB', points: 2 }
        ],
        [
            { name: 'TypeA' },
            { name: 'TypeB', weight: 2 }
        ]
    );

    suite('Create deck', () => {

        test('Create empty deck', () => {
            const deck = new Deck(deckOneCardOneType);
            assert.equal(deck.cards.length, 0, 'Deck should have no cards on init');
            assert.deepStrictEqual(deck.deckType, deckOneCardOneType, 'Deck type instance should be unchanged');
        });

        test('Build deckOneCardOneType', () => {
            const deck = new Deck(deckOneCardOneType);
            const deckInstance = deck.build();

            assert.equal(deckInstance, deck, 'deck.build should return the mutated instance');
            assert.equal(deck.cards.length, 1, 'Deck has wrong amount of cards');

            const card = deck.cards[0];
            assert.equal(card.name, 'CardA', 'Deck card has wrong name');
            assert.equal(card.points, 1, 'Deck card has wrong points');
            assert.deepStrictEqual(card.cardType, { name: 'TypeA' } as CardType, 'Deck card 1 has wrong card type');
        });

        test('Build deckTwoCardsTwoTypes', () => {
            const deck = new Deck(deckTwoCardsTwoTypes);
            const deckInstance = deck.build();

            assert.equal(deckInstance, deck, 'deck.build should return the mutated instance');
            assert.equal(deck.cards.length, 4, 'Deck has wrong amount of cards');

            const card2 = deck.cards[1];
            assert.equal(card2.name, 'CardB', 'Deck card 2 has wrong name');
            assert.equal(card2.points, 2, 'Deck card 2 has wrong points');
            assert.deepStrictEqual(card2.cardType, { name: 'TypeA' } as CardType, 'Deck card 2 has wrong card type');

            const card3 = deck.cards[2];
            assert.equal(card3.name, 'CardA', 'Deck card 3 has wrong name');
            assert.equal(card3.points, 1, 'Deck card 3 has wrong points');
            assert.deepStrictEqual(card3.cardType, { name: 'TypeB', weight: 2 } as CardType, 'Deck card 3 has wrong card type');
        });
    });

    suite('Draw cards', () => {
        test('Draw 1 card from the top (deckTwoCardsTwoTypes)', () => {
            const deck = new Deck(deckTwoCardsTwoTypes);
            const cards = deck.build().draw(DeckPosition.top, 1);

            assert.equal(deck.cards.length, 3, 'One card should have been removed from the deck');
            assert.equal(cards.length, 1, 'Should have drew 1 card');
            assert.equal(cards[0].name, 'CardB', 'Wrong card name');
            assert.equal(cards[0].cardType?.name, 'TypeB', 'Wrong card type');
        });

        test('Draw 2 card from the top (deckTwoCardsTwoTypes)', () => {
            const deck = new Deck(deckTwoCardsTwoTypes);
            const cards = deck.build().draw(DeckPosition.top, 2);

            assert.equal(deck.cards.length, 2, 'Two cards should have been removed from the deck');
            assert.equal(cards.length, 2, 'Should have drew 2 card');
            assert.equal(cards[0].name, 'CardB', 'Wrong card 1 name');
            assert.equal(cards[0].cardType?.name, 'TypeB', 'Wrong card 1 type');
            assert.equal(cards[1].name, 'CardA', 'Wrong card 2 name');
            assert.equal(cards[1].cardType?.name, 'TypeB', 'Wrong card 2 type');
        });

        test('Draw more cards than deck size from the top (deckTwoCardsTwoTypes)', () => {
            const deck = new Deck(deckTwoCardsTwoTypes);
            assert.throws(() => deck.build().draw(DeckPosition.top, 5), new DeckError(DeckErrorType.outOfBoundDraw));
        });

        test('Draw 1 card from the bottom (deckTwoCardsTwoTypes)', () => {
            const deck = new Deck(deckTwoCardsTwoTypes);
            const cards = deck.build().draw(DeckPosition.bottom, 1);

            assert.equal(deck.cards.length, 3, 'One card should have been removed from the deck');
            assert.equal(cards.length, 1, 'Should have drew 1 card');
            assert.equal(cards[0].name, 'CardA', 'Wrong card name');
            assert.equal(cards[0].cardType?.name, 'TypeA', 'Wrong card type');
        });

        test('Draw 2 card from the bottom (deckTwoCardsTwoTypes)', () => {
            const deck = new Deck(deckTwoCardsTwoTypes);
            const cards = deck.build().draw(DeckPosition.bottom, 2);

            assert.equal(deck.cards.length, 2, 'Two cards should have been removed from the deck');
            assert.equal(cards.length, 2, 'Should have drew 2 card');
            assert.equal(cards[0].name, 'CardA', 'Wrong card 1 name');
            assert.equal(cards[0].cardType?.name, 'TypeA', 'Wrong card 1 type');
            assert.equal(cards[1].name, 'CardB', 'Wrong card 2 name');
            assert.equal(cards[1].cardType?.name, 'TypeA', 'Wrong card 2 type');
        });

        test('Draw more cards than deck size from the bottom (deckTwoCardsTwoTypes)', () => {
            const deck = new Deck(deckTwoCardsTwoTypes);
            assert.throws(() => deck.build().draw(DeckPosition.bottom, 5), new DeckError(DeckErrorType.outOfBoundDraw));
        });
    });

    suite('Shuffle', () => {
        test('Suffle deckTwoCardsTwoTypes', () => {
            const deck = new Deck(deckTwoCardsTwoTypes).build();
            assert.doesNotThrow(() => deck.shuffle(), '.shuffle has thrown');
            assert.equal(deck.cards.length, 4, 'Expected amount of cards to not change');
        });
    });
});
