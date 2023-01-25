import * as assert from 'assert';
import PileCounterView from '../../../components/PileCounterView';
import { cleanHtmlString } from '../../../utils';

describe('PileCounterView', () => {
    it('Check if hidden with pile < 1', () => {
        let pileView = new PileCounterView({ pile: [] });
        assert.strictEqual(pileView.renderHtml(), '', 'Should be hidden');

        pileView = new PileCounterView({ pile: [{ name: 'CardA', points: 1 }] });
        assert.strictEqual(pileView.renderHtml(), '', 'Should be hidden');
    });

    it('Check count if > 1', () => {
        const pileView = new PileCounterView({ pile: [{ name: 'CardA', points: 1 }, { name: 'CardB', points: 2 }] });
        assert.strictEqual(getPileCount(pileView.renderHtml()), 'x2', 'Wrong count');
    });
});

function getPileCount(html: string) {
    const matches = /<div class="card-pile-count">([\s\S]+?)<\/div>/gi.exec(html);
    if (!matches || matches?.length < 2) {
        return '';
    }
    return cleanHtmlString(matches[1]);
}
