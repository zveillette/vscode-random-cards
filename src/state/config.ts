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

    async setCustomDecks(value: DeckTypeJson[]) {
        await this.setConfigValue(ConfigKeys.customDecks, value);
    }

    async reset() {
        await this.setAggregatePile(false);
        await this.setCustomDecks([]);
        await this.setDeckType('standard');
        await this.setIsBadgeNotificationEnabled(false);
        await this.setIsNotificationEnabled(false);
        await this.setPickEvery(-1);
        await this.setPileUp(false);
        await this.setUseWeight(false);
    }

    private async setConfigValue(key: ConfigKeys, value: unknown) {
        await vscode.workspace.getConfiguration(CONFIG_NAME).update(key, value, vscode.ConfigurationTarget.Global);
    }

    private getConfigValue(key: ConfigKeys): unknown {
        return vscode.workspace.getConfiguration(CONFIG_NAME).get(key);
    }
}