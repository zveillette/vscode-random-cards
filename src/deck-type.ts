import { Card, CardType } from "./deck";

export class DeckType {
    private _name: string = '';
    private _cards: Card[] = [];
    private _cardTypes: CardType[] = [];

    public get name(): string {
        return this._name;
    }

    public get cards(): Card[] {
        return this._cards;
    }

    public get cardTypes(): CardType[] {
        return this._cardTypes;
    }

    build(name: string, cards: Card[], cardTypes: CardType[]) {
        this._name = name;
        this._cards = cards;
        this._cardTypes = cardTypes;

        return this;
    }

    fromJSON(json: string): DeckType {
        const data = JSON.parse(json) as DeckTypeJson;
        this._name = data.name;
        this._cards = data.cards;
        this._cardTypes = data.cardTypes;
        
        return this;
    }
}

interface DeckTypeJson {
    name: string,
    cards: Card[],
    cardTypes: {
        name: string,
        weight?: number;
        icon?: string
    }[]
}

