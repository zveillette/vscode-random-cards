import * as vscode from 'vscode';

const CONFIG_NAME = 'zvRandomCards';

enum ConfigKeys {
    pickEvery = 'pickEvery',
    enableBadgeNotification = 'enableBadgeNotification'
}

export class Config {
    static get pickEvery(): number {
        return Number(vscode.workspace.getConfiguration(CONFIG_NAME).get(ConfigKeys.pickEvery));
    }

    static get isBadgeNotificationEnabled(): boolean {
        return Boolean(vscode.workspace.getConfiguration(CONFIG_NAME).get(ConfigKeys.enableBadgeNotification));
    }
}