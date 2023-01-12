import * as vscode from 'vscode';

export const CONFIG_NAME = 'zvRandomCards';

export enum ConfigKeys {
    pickEvery = 'pickEvery',
    enableBadgeNotification = 'enableBadgeNotification',
    deckType = 'deckType',
    nextDraw = 'nextDraw',
    enableNotification = 'enableNotification',
    pileUp = 'pileUp'
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

    static get pileUp(): boolean {
        return Boolean(vscode.workspace.getConfiguration(CONFIG_NAME).get(ConfigKeys.pileUp));
    }
}