import { randomInt } from 'crypto';
import { DeckError, DeckErrorType } from './deck-error';
import { DeckType } from './deck-type';

export class Deck {
    private _cards: Card[] = [];
    private _deckType: DeckType;
    constructor(deckType: DeckType) {
        this._deckType = deckType;
    }

    /**
     * Get all the deck cards in its current state
     */
    public get cards() {
        return this._cards;
    }

    public get deckType() {
        return this._deckType;
    }

    public set deckType(deckType: DeckType) {
        this._deckType = deckType;
    }

    /**
     * Build (or rebuild) deck of cards
     * @returns Mutated instance
     */
    build(deckType?: DeckType) {
        this._deckType = deckType ? deckType : this._deckType;
        this._cards = this._deckType.cardTypes.reduce((cards, cardType) =>
            cards.concat(this._deckType.cards.map((card) => ({ ...card, cardType }))), [] as Card[]);

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
            throw new DeckError(DeckErrorType.outOfBoundDraw);
        }

        switch (position) {
            case DeckPosition.bottom:
                return this._cards.splice(0, amount);
            case DeckPosition.top:
            default:
                return this._cards.splice(this._cards.length - amount, this._cards.length).reverse();
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

export interface CardType {
    name: string,
    weight?: number
    icon?: string
}
