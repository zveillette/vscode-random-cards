import { Config } from '../state/config';

export default (config: Config) => {
    const difficultyLevel = config.difficultyLevel;
    let icon;
    switch(difficultyLevel) {
        case 1:
            icon = '😎';
        break;
        case 2:
            icon = '🤠';
        break;
        case 3:
            icon = '😱';
        break;
        case 4:
            icon = '😭';
        break;
        case 5:
            icon = '😵';
        break;
    }
    return `
        <p class="difficulty-indicator">Difficulty: ${config.difficultyLevel} ${icon}</p>
    `;
};