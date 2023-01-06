import { randomInt } from 'crypto';

export const DECK_TYPES = Object.freeze({
    standard: {
        name: 'Standard',
        cardTypes: [{ name: 'Clubs' }, { name: 'Diamonds' }, { name: 'Hearts' }, { name: 'Spades' }],
        cards: [
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
        ]
    } as DeckType
});

export class Deck {
    private _cards: Card[] = [];
    private _deckType: DeckType;
    constructor(deckType: DeckType) {
        this._deckType = deckType;
        this.build(this._deckType);
    }

    /**
     * Get all the deck cards in its current state
     */
    public get cards() {
        return this._cards;
    }


    /**
     * Type of deck used to generate the cards
     */
    public get deckType() {
        return this._deckType;
    }

    /**
     * Build (or rebuild) deck of cards
     * @returns Mutated instance
     */
    build(deckType: DeckType) {
        this._deckType = deckType;
        this._cards = deckType.cardTypes.reduce((cards, cardType) =>
            cards.concat(deckType.cards.map((card) => ({ ...card, cardType }))), [] as Card[]);

        return this;
    }

    /**
     * @returns Mutated instance
     */
    shuffle(): Deck {
        for (let i = this._cards.length - 1; i > 0; i--) {
            const j = Math.floor(randomInt((i + 1)));
            [this._cards[i], this._cards[j]] = [this._cards[j], this._cards[i]];
        }
        return this;
    }

    /**
     * Draw card(s) and remove them from the deck
     * @param position Where to draw cards from
     * @param amount Amount of cards to draw
     */
    draw(position: DeckPosition, amount: number): Card[] {
        if (this._cards.length < amount) {
            return [];
        }

        switch (position) {
            case DeckPosition.bottom:
                return [this._cards[this._cards.length - 1]];
            case DeckPosition.top:
            default:
                return [this._cards[0]];
        }
    }
}

export enum DeckPosition {
    top = 'Top',
    bottom = 'Bottom'
}

export interface Card {
    name: string,
    points: number,
    cardType?: CardType
}

interface DeckType {
    name: string,
    cards: Card[],
    cardTypes: {
        name: string,
        icon?: string
    }[]
}

interface CardType {
    name: string,
    icon?: string
}
