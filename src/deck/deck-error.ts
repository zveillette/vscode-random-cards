import { Deck } from "./deck";

export enum DeckErrorType {
    outOfBoundDraw = 'Deck has not enough cards'
}

export class DeckError extends Error {
    constructor(private _type: DeckErrorType) {
        super(_type);
        Object.setPrototypeOf(this, DeckError.prototype);
    }

    public get type(): DeckErrorType {
        return this._type;
    }
}