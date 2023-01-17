import { Card, CardType } from "../deck/deck";

export class DeckType {
    public get name(): string {
        return this._name;
    }

    public get cards(): Card[] {
        return this._cards;
    }

    public get cardTypes(): CardType[] {
        return this._cardTypes;
    }

    constructor(private _name: string, private _cards: Card[], private _cardTypes: CardType[]) { }
}

export interface DeckTypeJson {
    name: string,
    cards: Card[],
    cardTypes: {
        name: string,
        weight?: number;
        icon?: string
    }[]
}

