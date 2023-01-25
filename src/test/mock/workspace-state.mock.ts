import * as vscode from 'vscode';
import { Card } from "../../deck/deck";

export class WorkspaceStateMock {
    private readonly _context: vscode.ExtensionContext;
    private _nextDraw: Date | null = null;
    private _pile: Card[] = [];

    constructor() {
        this._context = {} as vscode.ExtensionContext;
    }

    public getNextDraw(): Date | null {
        return this._nextDraw;
    }
    public setNextDraw(value: Date | null): Promise<void> {
        this._nextDraw = value;
        return new Promise((resolve) => resolve());
    }
    public getCardPile(): Card[] {
        return this._pile;
    }
    public setCardPile(value: Card[]): Promise<void> {
        this._pile = value;
        return new Promise((resolve) => resolve());
    }
}