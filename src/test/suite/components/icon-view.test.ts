import * as assert from 'assert';
import IconView from '../../../components/IconView';
import { cleanHtmlString } from '../../../utils';

describe('IconView', () => {
    it('With name', () => {
        const iconView = new IconView({ name: 'account' });
        assert.strictEqual(getIconTag(iconView.renderHtml()), '<i class="icon codicon codicon-account" title="" style="font-size: 16px; min-width: 16px"></i>');
    });

    it('With title', () => {
        const iconView = new IconView({ name: 'account', title: 'Account' });
        assert.strictEqual(getIconTag(iconView.renderHtml()), '<i class="icon codicon codicon-account" title="Account" style="font-size: 16px; min-width: 16px"></i>');
    });

    it('With size', () => {
        const iconView = new IconView({ name: 'account', title: 'Account', size: '2rem' });
        assert.strictEqual(getIconTag(iconView.renderHtml()), '<i class="icon codicon codicon-account" title="Account" style="font-size: 2rem; min-width: 2rem"></i>');
    });
});

function getIconTag(html: string) {
    return cleanHtmlString(html);
}
