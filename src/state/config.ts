import * as vscode from 'vscode';
import { DeckTypeJson } from '../deck/deck-type';

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
    useWeight = 'useWeight',
    customDecks = 'customDecks'
}

export class Config {
    get pickEvery(): number {
        return Number(this.getConfigValue(ConfigKeys.pickEvery));
    }

    get isBadgeNotificationEnabled(): boolean {
        return Boolean(this.getConfigValue(ConfigKeys.enableBadgeNotification));
    }

    get isNotificationEnabled(): boolean {
        return Boolean(this.getConfigValue(ConfigKeys.enableNotification));
    }

    get deckType(): string {
        return String(this.getConfigValue(ConfigKeys.deckType));
    }

    get pileUp(): boolean {
        return Boolean(this.getConfigValue(ConfigKeys.pileUp));
    }

    get useWeight(): boolean {
        return Boolean(this.getConfigValue(ConfigKeys.useWeight));
    }

    get aggregatePile(): boolean {
        return Boolean(this.getConfigValue(ConfigKeys.aggregatePile));
    }

    get difficultyLevel(): number {
        const difficultyLevel = this.getConfigValue(ConfigKeys.difficultyLevel) as number;

        if (difficultyLevel < 1) {
            return 1;
        }
        if (difficultyLevel > 5) {
            return 5;
        }

        return difficultyLevel;
    }

    get customDecks(): DeckTypeJson[] {
        return this.getConfigValue(ConfigKeys.customDecks) as DeckTypeJson[];
    }

    private getConfigValue(key: ConfigKeys): unknown {
        return vscode.workspace.getConfiguration(CONFIG_NAME).get(key);
    }
}