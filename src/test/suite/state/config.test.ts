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
});
