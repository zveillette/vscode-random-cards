import * as assert from 'assert';
import CardView from '../../../components/CardView';
import { Card } from '../../../deck/deck';
import { cleanHtmlString } from '../../../utils';

describe('CardView', () => {
    describe('Without aggregate', () => {
        it('Without card type', () => {
            const currentCard = { name: 'CardA', points: 1 } as Card;
            const cardView = new CardView({ difficultyLevel: 1, currentCard });
            const cardHtml = cardView.renderHtml();

            assert.strictEqual(getNames(cardHtml)[0], 'CardA', 'Name is not displayed');
            assert.strictEqual(getPoints(cardHtml), '1', 'Wrong card points');
        });

        it('With card type', () => {
            const currentCard = { name: 'CardA', points: 1, cardType: { name: 'TypeA' } } as Card;
            const cardView = new CardView({ difficultyLevel: 1, currentCard });
            const cardHtml = cardView.renderHtml();

            assert.strictEqual(getNames(cardHtml)[0], 'TypeA: CardA', 'Wrong name displayed');
            assert.strictEqual(getPoints(cardHtml), '1', 'Wrong card points');
        });

        it('Using weight', () => {
            const currentCard = { name: 'CardA', points: 1, cardType: { name: 'TypeA' } } as Card;
            const cardView = new CardView({ useWeight: true, difficultyLevel: 1, currentCard });
            const cardHtml = cardView.renderHtml();

            assert.strictEqual(getNames(cardHtml)[0], 'TypeA: CardA <span class="card-weight">(x1)</span>', 'Wrong name displayed');
            assert.strictEqual(getPoints(cardHtml), '1', 'Wrong card points');
        });

        it('Check weight calculation', () => {
            let currentCard = { name: 'CardA', points: 12, cardType: { name: 'TypeA', weight: 2 } } as Card;
            let cardView = new CardView({ useWeight: true, difficultyLevel: 1, currentCard });
            assert.strictEqual(getPoints(cardView.renderHtml()), '24', 'Wrong card points');

            currentCard = { name: 'CardA', points: 5, cardType: { name: 'TypeA', weight: 0.2635 } } as Card;
            cardView = new CardView({ useWeight: true, difficultyLevel: 1, currentCard });
            assert.strictEqual(getPoints(cardView.renderHtml()), '2', 'Wrong card points');
        });

        it('Check weight calculation with difficulty', () => {
            let currentCard = { name: 'CardA', points: 12, cardType: { name: 'TypeA', weight: 2 } } as Card;
            let cardView = new CardView({ useWeight: true, difficultyLevel: 3, currentCard });
            assert.strictEqual(getPoints(cardView.renderHtml()), '72', 'Wrong card points');

            currentCard = { name: 'CardA', points: 5, cardType: { name: 'TypeA', weight: 0.2635 } } as Card;
            cardView = new CardView({ useWeight: true, difficultyLevel: 2, currentCard });
            assert.strictEqual(getPoints(cardView.renderHtml()), '3', 'Wrong card points');
        });

        it('Check that difficulty is displayed', () => {
            const currentCard = { name: 'CardA', points: 1 } as Card;
            const cardView = new CardView({ difficultyLevel: 3, currentCard });
            const difficulty = getDifficulty(cardView.renderHtml());
            assert.strictEqual(difficulty, 'Difficulty: 3 😱', 'Difficulty should be displayed');
        });
    });

    describe('With aggregate', () => {
        it('Empty pile', () => {
            const pile: Card[] = [];
            const cardView = new CardView({ aggregatePile: true, difficultyLevel: 1, pile });
            assert.strictEqual(getNames(cardView.renderHtml()).length, 0, 'Nothing should be displayed');
        });

        it('Same card types in the pile', () => {
            const pile: Card[] = [
                { name: 'CardA', points: 1, cardType: { name: 'TypeA' } },
                { name: 'CardB', points: 5, cardType: { name: 'TypeA' } }
            ];
            const cardView = new CardView({ aggregatePile: true, difficultyLevel: 1, pile });
            const names = getNames(cardView.renderHtml());

            assert.strictEqual(names.length, 1, 'Wrong amount of names displayed');
            assert.strictEqual(names[0], 'TypeA: 6', 'Wrong points displayed');
        });

        it('Different card types in the pile', () => {
            const pile: Card[] = [
                { name: 'CardA', points: 1, cardType: { name: 'TypeA' } },
                { name: 'CardB', points: 5, cardType: { name: 'TypeB' } }
            ];
            const cardView = new CardView({ aggregatePile: true, difficultyLevel: 1, pile });
            const names = getNames(cardView.renderHtml());

            assert.strictEqual(names.length, 2, 'Wrong amount of names displayed');
            assert.strictEqual(names[0], 'TypeA: 1', 'Wrong points displayed');
            assert.strictEqual(names[1], 'TypeB: 5', 'Wrong points displayed');
        });

        it('Different card types and aggregation', () => {
            const pile: Card[] = [
                { name: 'CardA', points: 1, cardType: { name: 'TypeA' } },
                { name: 'CardB', points: 5, cardType: { name: 'TypeB' } },
                { name: 'CardB', points: 5, cardType: { name: 'TypeA' } },
                { name: 'CardA', points: 1, cardType: { name: 'TypeB' } }
            ];
            const cardView = new CardView({ aggregatePile: true, difficultyLevel: 1, pile });
            const names = getNames(cardView.renderHtml());

            assert.strictEqual(names.length, 2, 'Wrong amount of names displayed');
            assert.strictEqual(names[0], 'TypeA: 6', 'Wrong points displayed');
            assert.strictEqual(names[1], 'TypeB: 6', 'Wrong points displayed');
        });

        it('Check weight calculation with different card types and aggregation', () => {
            const pile: Card[] = [
                { name: 'CardA', points: 1, cardType: { name: 'TypeA' } },
                { name: 'CardB', points: 5, cardType: { name: 'TypeB', weight: 2 } },
                { name: 'CardB', points: 5, cardType: { name: 'TypeA' } },
                { name: 'CardA', points: 1, cardType: { name: 'TypeB', weight: 2 } }
            ];
            const cardView = new CardView({ aggregatePile: true, useWeight: true, difficultyLevel: 1, pile });
            const names = getNames(cardView.renderHtml());

            assert.strictEqual(names.length, 2, 'Wrong amount of names displayed');
            assert.strictEqual(names[0], 'TypeA <span class="card-weight">(x1)</span>: 6', 'Wrong points displayed');
            assert.strictEqual(names[1], 'TypeB <span class="card-weight">(x2)</span>: 12', 'Wrong points displayed');
        });

        it('Check weight calculation with different card types and aggregation and difficulty', () => {
            const pile: Card[] = [
                { name: 'CardA', points: 1, cardType: { name: 'TypeA' } },
                { name: 'CardB', points: 5, cardType: { name: 'TypeB', weight: 2 } },
                { name: 'CardB', points: 5, cardType: { name: 'TypeA' } },
                { name: 'CardA', points: 1, cardType: { name: 'TypeB', weight: 2 } }
            ];
            const cardView = new CardView({ aggregatePile: true, useWeight: true, difficultyLevel: 3, pile });
            const names = getNames(cardView.renderHtml());

            assert.strictEqual(names.length, 2, 'Wrong amount of names displayed');
            assert.strictEqual(names[0], 'TypeA <span class="card-weight">(x1)</span>: 18', 'Wrong points displayed');
            assert.strictEqual(names[1], 'TypeB <span class="card-weight">(x2)</span>: 36', 'Wrong points displayed');
        });

        it('Check that difficulty is displayed', () => {
            const pile: Card[] = [
                { name: 'CardA', points: 1, cardType: { name: 'TypeA' } },
                { name: 'CardB', points: 5, cardType: { name: 'TypeB', weight: 2 } },
                { name: 'CardB', points: 5, cardType: { name: 'TypeA' } },
                { name: 'CardA', points: 1, cardType: { name: 'TypeB', weight: 2 } }
            ];
            const cardView = new CardView({ aggregatePile: true, useWeight: true, difficultyLevel: 3, pile });
            const difficulty = getDifficulty(cardView.renderHtml());
            assert.strictEqual(difficulty, 'Difficulty: 3 😱', 'Difficulty should be displayed');
        });
    });
});

function getDifficulty(html: string) {
    const matches = /<p class="difficulty-indicator">([\s\S]+?)<\/p>/gi.exec(html);
    if (!matches || matches?.length < 2) {
        return '';
    }
    return cleanHtmlString(matches[1]);
}

function getNames(html: string): string[] {
    const regex = new RegExp(/<div class="card-title">([\s\S]+?)<\/div>/gi);

    const cardNames = [];
    let match = regex.exec(html);
    while (match !== null) {
        cardNames.push(cleanHtmlString(match[1]));
        match = regex.exec(html);
    }
    return cardNames;
}

function getPoints(html: string) {
    const matches = /<div class="card-pts">([\s\S]+?)<\/div>/gi.exec(html);
    if (!matches || matches?.length < 2) {
        return '';
    }
    return cleanHtmlString(matches[1]);
}
