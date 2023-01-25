import * as assert from 'assert';
import { Config } from '../../../state/config';

describe('Config', () => {
    let config: Config;
    before(() => {
        config = new Config();
    });

    beforeEach(async () => {
        await config.reset();
    });

    it('When setting "AggregatePile", "PileUp" should be enabled', async () => {
        await config.setAggregatePile(true);
        assert.strictEqual(config.aggregatePile, true, 'Wrong aggregate pile');
        assert.strictEqual(config.pileUp, true, 'Wrong pile up');
    });

    it('When unsetting "PileUp", "AggregatePile" should be disabled', async () => {
        await config.setPileUp(false);
        assert.strictEqual(config.pileUp, false, 'Wrong pile up');
        assert.strictEqual(config.aggregatePile, false, 'Wrong aggregate pile');
    });

    it('Difficulty level should be between 1 & 5', async () => {
        await config.setDifficultyLevel(-1);
        assert.strictEqual(config.difficultyLevel, 1, 'Invalid difficulty level');

        await config.setDifficultyLevel(1);
        assert.strictEqual(config.difficultyLevel, 1, 'Invalid difficulty level');

        await config.setDifficultyLevel(5);
        assert.strictEqual(config.difficultyLevel, 5, 'Invalid difficulty level');

        await config.setDifficultyLevel(2.5);
        assert.strictEqual(config.difficultyLevel, 2, 'Invalid difficulty level');

        await config.setDifficultyLevel(5.5);
        assert.strictEqual(config.difficultyLevel, 5, 'Invalid difficulty level');

        await config.setDifficultyLevel(6);
        assert.strictEqual(config.difficultyLevel, 5, 'Invalid difficulty level');
    });
});
