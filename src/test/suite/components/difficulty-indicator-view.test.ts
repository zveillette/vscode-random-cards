import * as assert from 'assert';
import DifficultyIndicatorView from '../../../components/DifficultyIndicatorView';
import { cleanHtmlString } from '../../../utils';

describe('DifficultyIndicatorView', () => {
    it('Check difficulty levels', () => {
        let difficultyIndicatorView = new DifficultyIndicatorView({ difficultyLevel: 1 });
        assert.equal(getDifficulty(difficultyIndicatorView.renderHtml()), `Difficulty: 1 😎`, 'Wrong difficulty render');

        difficultyIndicatorView = new DifficultyIndicatorView({ difficultyLevel: 3 });
        assert.equal(getDifficulty(difficultyIndicatorView.renderHtml()), `Difficulty: 3 😱`, 'Wrong difficulty render');

        difficultyIndicatorView = new DifficultyIndicatorView({ difficultyLevel: 6 });
        assert.equal(getDifficulty(difficultyIndicatorView.renderHtml()), `Difficulty: 6 🤡`, 'Wrong difficulty render');

        difficultyIndicatorView = new DifficultyIndicatorView({ difficultyLevel: 1.2 });
        assert.equal(getDifficulty(difficultyIndicatorView.renderHtml()), `Difficulty: 1.2 🤡`, 'Wrong difficulty render');
    });
});

function getDifficulty(html: string) {
    const matches = /<p class="difficulty-indicator">([\s\S]+?)<\/p>/gi.exec(html);
    if (!matches || matches?.length < 2) {
        return '';
    }
    return cleanHtmlString(matches[1]);
}
