import * as assert from 'assert';
import { config } from 'process';
import * as vscode from 'vscode';
import { DeckTypeJson } from '../../../deck/deck-type';
import { getDeckTypes } from '../../../deck/deck-types';
import { Config } from '../../../state/config';

describe('DeckTypes', () => {
    let customDeckA = {
        name: 'CustomDeckA',
        cards: [],
        cardTypes: []
    } as DeckTypeJson;

    let customDeckB = {
        name: 'CustomDeckB',
        cards: [
            { name: 'CardA', points: 1 },
            { name: 'CardB', points: 2 }
        ],
        cardTypes: [
            { name: 'TypeA' },
            { name: 'TypeB', weight: 2 }
        ]
    } as DeckTypeJson;


    let config: Config;
    before(function () {
        config = new Config();
    });

    beforeEach(async () => {
        config.setCustomDecks([]);
    });

    it('Get default deck types', () => {
        const deckTypes = getDeckTypes(config);

        ['standard', 'training'].forEach((deck) => {
            assert.ok(deckTypes[deck], `Missing deck ${deck}`);
        });
    });

    it('Check if custom deck types are added', async () => {
        await config.setCustomDecks([customDeckA, customDeckB]);
        const deckTypes = getDeckTypes(config);

        ['standard', 'training', 'CustomDeckA', 'CustomDeckB'].forEach((deck) => {
            assert.ok(deckTypes[deck], `Missing deck ${deck}`);
        });
    });
});
