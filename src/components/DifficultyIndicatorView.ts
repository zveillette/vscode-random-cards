import { Config } from '../config';

export default () => {
  const difficultyLevel = Config.difficultyLevel;
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
    <p class="difficulty-indicator">Difficulty: ${Config.difficultyLevel} ${icon}</p>
  `;
};