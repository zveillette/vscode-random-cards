import * as vscode from 'vscode';

export const CONFIG_NAME = 'zvRandomCards';

export enum ConfigKeys {
    pickEvery = 'pickEvery',
    enableBadgeNotification = 'enableBadgeNotification',
    deckType = 'deckType',
    nextDraw = 'nextDraw',
    enableNotification = 'enableNotification',
    pileUp = 'pileUp',
    difficultyLevel = 'difficultyLevel',
    aggregatePile = 'aggregatePile',
    useWeight = 'useWeight'
}

export class Config {
    static getConfigValue(key: ConfigKeys): unknown {
        return vscode.workspace.getConfiguration(CONFIG_NAME).get(key);
    }

    static get pickEvery(): number {
        return Number(Config.getConfigValue(ConfigKeys.pickEvery));
    }

    static get isBadgeNotificationEnabled(): boolean {
        return Boolean(Config.getConfigValue(ConfigKeys.enableBadgeNotification));
    }
    
    static get isNotificationEnabled(): boolean {
        return Boolean(Config.getConfigValue(ConfigKeys.enableNotification));
    }

    static get deckType(): string {
        return String(Config.getConfigValue(ConfigKeys.deckType));
    }

    static get pileUp(): boolean {
        return Boolean(Config.getConfigValue(ConfigKeys.pileUp));
    }

    static get useWeight(): boolean {
        return Boolean(Config.getConfigValue(ConfigKeys.useWeight));
    }

    static get aggregatePile(): boolean {
        return Boolean(Config.getConfigValue(ConfigKeys.aggregatePile));
    }

    static get difficultyLevel(): number {
        const difficultyLevel = Config.getConfigValue(ConfigKeys.difficultyLevel) as number;

        if(difficultyLevel < 1) {
            return 1;
        }
        if(difficultyLevel > 5) {
            return 5;
        }

        return difficultyLevel;
    }
}