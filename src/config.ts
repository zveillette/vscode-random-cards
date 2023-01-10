import * as vscode from 'vscode';

export const CONFIG_NAME = 'zvRandomCards';

export enum ConfigKeys {
    pickEvery = 'pickEvery',
    enableBadgeNotification = 'enableBadgeNotification',
    deckType = 'deckType',
    nextDraw = 'nextDraw',
    enableNotification = 'enableNotification'
}

export class Config {
    static get pickEvery(): number {
        return Number(vscode.workspace.getConfiguration(CONFIG_NAME).get(ConfigKeys.pickEvery));
    }

    static get isBadgeNotificationEnabled(): boolean {
        return Boolean(vscode.workspace.getConfiguration(CONFIG_NAME).get(ConfigKeys.enableBadgeNotification));
    }
    
    static get isNotificationEnabled(): boolean {
        return Boolean(vscode.workspace.getConfiguration(CONFIG_NAME).get(ConfigKeys.enableNotification));
    }

    static get deckType(): string {
        return String(vscode.workspace.getConfiguration(CONFIG_NAME).get(ConfigKeys.deckType));
    }

    static get nextDraw(): Date | null {
        const nextDraw = String(vscode.workspace.getConfiguration(CONFIG_NAME).get(ConfigKeys.nextDraw));
        if (!nextDraw) {
            return null;
        }

        return new Date(nextDraw);
    }

    static async setNextDraw(date: Date | null) {
        await vscode.workspace.getConfiguration(CONFIG_NAME).update(ConfigKeys.nextDraw, date);
    }
}