import * as assert from 'assert';
import * as vscode from 'vscode';

describe('Extension', () => {
    it('Activate without throwing', async () => {
        const context = await vscode.extensions.getExtension('zveillette.zv-random-cards')?.activate();
        assert.ok(context, 'Extension didn\'t return context');
    });
});
