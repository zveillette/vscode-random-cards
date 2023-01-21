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

            assert.equal(getNames(cardHtml)[0], 'CardA', 'Name is not displayed');
            assert.match(getAmount(cardHtml), /^Amount :( )+?1$/, 'Wrong card points');
        });

        it('With card type', () => {
            const currentCard = { name: 'CardA', points: 1, cardType: { name: 'TypeA' } } as Card;
            const cardView = new CardView({ difficultyLevel: 1, currentCard });
            const cardHtml = cardView.renderHtml();

            assert.equal(getNames(cardHtml)[0], 'TypeA: CardA', 'Wrong name displayed');
            assert.match(getAmount(cardHtml), /^Amount :( )+?1$/, 'Wrong card amount displayed');
        });

        it('Using weight', () => {
            const currentCard = { name: 'CardA', points: 1, cardType: { name: 'TypeA' } } as Card;
            const cardView = new CardView({ useWeight: true, difficultyLevel: 1, currentCard });
            const cardHtml = cardView.renderHtml();

            assert.equal(getNames(cardHtml)[0], 'TypeA: CardA', 'Wrong name displayed');
            assert.match(getAmount(cardHtml), /^Amount \(x1\):( )+?1$/, 'Wrong card amount displayed');
        });

        it('Check weight calculation', () => {
            let currentCard = { name: 'CardA', points: 12, cardType: { name: 'TypeA', weight: 2 } } as Card;
            let cardView = new CardView({ useWeight: true, difficultyLevel: 1, currentCard });
            assert.match(getAmount(cardView.renderHtml()), /^Amount \(x2\):( )+?24$/, 'Wrong card amount displayed (expecting 24)');

            currentCard = { name: 'CardA', points: 5, cardType: { name: 'TypeA', weight: 0.2635 } } as Card;
            cardView = new CardView({ useWeight: true, difficultyLevel: 1, currentCard });
            assert.match(getAmount(cardView.renderHtml()), /^Amount \(x0.2635\):( )+?2$/, 'Wrong card amount displayed (expecting 2 calculates to 1.3175)');
        });

        it('Check weight calculation with difficulty', () => {
            let currentCard = { name: 'CardA', points: 12, cardType: { name: 'TypeA', weight: 2 } } as Card;
            let cardView = new CardView({ useWeight: true, difficultyLevel: 3, currentCard });
            assert.match(getAmount(cardView.renderHtml()), /^Amount \(x2\):( )+?72$/, 'Wrong card amount displayed (expecting 72)');

            currentCard = { name: 'CardA', points: 5, cardType: { name: 'TypeA', weight: 0.2635 } } as Card;
            cardView = new CardView({ useWeight: true, difficultyLevel: 2, currentCard });
            assert.match(getAmount(cardView.renderHtml()), /^Amount \(x0.2635\):( )+?3$/, 'Wrong card amount displayed (expecting 3 calculates to 1.3175)');
        });

        it('Check that difficulty is displayed', () => {
            const currentCard = { name: 'CardA', points: 1 } as Card;
            const cardView = new CardView({ difficultyLevel: 3, currentCard });
            const difficulty = getDifficulty(cardView.renderHtml());
            assert.equal(difficulty, 'Difficulty: 3 😱', 'Difficulty should be displayed');
        });
    });

    describe('With aggregate', () => {
        it('Empty pile', () => {
            const pile: Card[] = [];
            const cardView = new CardView({ aggregatePile: true, difficultyLevel: 1, pile });
            assert.equal(getNames(cardView.renderHtml()).length, 0, 'Nothing should be displayed');
        });

        it('Same card types in the pile', () => {
            const pile: Card[] = [
                { name: 'CardA', points: 1, cardType: { name: 'TypeA' } },
                { name: 'CardB', points: 5, cardType: { name: 'TypeA' } }
            ];
            const cardView = new CardView({ aggregatePile: true, difficultyLevel: 1, pile });
            const names = getNames(cardView.renderHtml());

            assert.equal(names.length, 1, 'Wrong amount of names displayed');
            assert.match(names[0], /^TypeA:( )+?6$/, 'Wrong amount displayed');
        });

        it('Different card types in the pile', () => {
            const pile: Card[] = [
                { name: 'CardA', points: 1, cardType: { name: 'TypeA' } },
                { name: 'CardB', points: 5, cardType: { name: 'TypeB' } }
            ];
            const cardView = new CardView({ aggregatePile: true, difficultyLevel: 1, pile });
            const names = getNames(cardView.renderHtml());

            assert.equal(names.length, 2, 'Wrong amount of names displayed');
            assert.match(names[0], /^TypeA:( )+?1$/, 'Wrong amount displayed TypeA');
            assert.match(names[1], /^TypeB:( )+?5$/, 'Wrong amount displayed TypeB');
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

            assert.equal(names.length, 2, 'Wrong amount of names displayed');
            assert.match(names[0], /^TypeA:( )+?6$/, 'Wrong amount displayed TypeA');
            assert.match(names[1], /^TypeB:( )+?6$/, 'Wrong amount displayed TypeB');
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

            assert.equal(names.length, 2, 'Wrong amount of names displayed');
            assert.match(names[0], /^TypeA \(x1\):( )+?6$/, 'Wrong amount displayed TypeA');
            assert.match(names[1], /^TypeB \(x2\):( )+?12$/, 'Wrong amount displayed TypeB');
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

            assert.equal(names.length, 2, 'Wrong amount of names displayed');
            assert.match(names[0], /^TypeA \(x1\):( )+?18$/, 'Wrong amount displayed TypeA');
            assert.match(names[1], /^TypeB \(x2\):( )+?36$/, 'Wrong amount displayed TypeB');
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
            assert.equal(difficulty, 'Difficulty: 3 😱', 'Difficulty should be displayed');
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

function getAmount(html: string) {
    const matches = /<p>([\s\S]+?)<\/p>/gi.exec(html);
    if (!matches || matches?.length < 2) {
        return '';
    }
    return cleanHtmlString(matches[1]);
}
