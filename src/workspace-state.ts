import * as vscode from 'vscode';

export const CONFIG_NAME = 'zvRandomCards';

export enum WorkspaceStateKeys {
    nextDraw = 'nextDraw'
}

export class WorkspaceState {
    constructor(private readonly _context: vscode.ExtensionContext) { }

    public getNextDraw(): Date | null {
        const nextDraw = this._context.workspaceState.get(WorkspaceStateKeys.nextDraw);
        if (!nextDraw) {
            return null;
        }
        return new Date(String(nextDraw));
    }

    public async setNextDraw(value: Date | null) {
        await this._context.workspaceState.update(WorkspaceStateKeys.nextDraw, value);
    }
}