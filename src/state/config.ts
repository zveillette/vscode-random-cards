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

    async setPickEvery(value: number) {
        await this.setConfigValue(ConfigKeys.pickEvery, value);
    }

    async setIsBadgeNotificationEnabled(value: boolean) {
        await this.setConfigValue(ConfigKeys.enableBadgeNotification, value);
    }

    async setIsNotificationEnabled(value: boolean) {
        await this.setConfigValue(ConfigKeys.enableNotification, value);
    }

    async setDeckType(value: string) {
        await this.setConfigValue(ConfigKeys.deckType, value);
    }

    async setPileUp(value: boolean) {
        await this.setConfigValue(ConfigKeys.pileUp, value);

        if (!value) {
            await this.setConfigValue(ConfigKeys.aggregatePile, value);
        }
    }

    async setUseWeight(value: boolean) {
        await this.setConfigValue(ConfigKeys.useWeight, value);
    }

    async setAggregatePile(value: boolean) {
        await this.setConfigValue(ConfigKeys.aggregatePile, value);

        if (value) {
            await this.setConfigValue(ConfigKeys.pileUp, value);
        }
    }

    async setDifficultyLevel(value: number) {
        let difficultyLevel = Math.floor(value);
        if (value < 1) {
            difficultyLevel = 1;
        }
        if (value > 5) {
            difficultyLevel = 5;
        }

        await this.setConfigValue(ConfigKeys.difficultyLevel, difficultyLevel);
    }
    
    async setCustomDecks(value: DeckTypeJson[]) {
        await this.setConfigValue(ConfigKeys.customDecks, value);
    }

    private async setConfigValue(key: ConfigKeys, value: unknown) {
        await vscode.workspace.getConfiguration(CONFIG_NAME).update(key, value, vscode.ConfigurationTarget.Global);
    }

    private getConfigValue(key: ConfigKeys): unknown {
        return vscode.workspace.getConfiguration(CONFIG_NAME).get(key);
    }
}