import { Config } from '../state/config';

type Props = {
    difficultyLevel: number
};

export default class DifficultyIndicatorView {
    constructor(public props: Props) { }

    getIcon(level: number) {
        switch (level) {
            case 1:
                return '😎';
            case 2:
                return '🤠';
            case 3:
                return '😱';
            case 4:
                return '😭';
            case 5:
                return '😵';
            default:
                return '🤡';
        }
    }

    render() {
        const { difficultyLevel } = this.props;
        return `
            <p class="difficulty-indicator">Difficulty: ${difficultyLevel} ${this.getIcon(difficultyLevel)}</p>
        `;
    }
}
