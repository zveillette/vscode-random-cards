import { Card} from "../deck";
import { Config } from '../config';

type Props = {
  currentCard: Card;
  pile: Card[];
};

export default (props: Props) => {
  const { currentCard, pile } = props;

  if(Config.aggregatePile) {
    const aggregatedPile = pile.reduce<Record<string, number>>((accumulator, card) => {
      if(!card.cardType) {
        return accumulator;
      }

      if(!accumulator[card.cardType.name]) {
        accumulator[card.cardType.name] = 0;
      }
      accumulator[card.cardType.name] += card.points;

      return accumulator;
    },{});

    return `
      <p class="difficulty-indicator">Difficulty: ${Config.difficultyLevel}</p>
      ${Object.keys(aggregatedPile).map((cardTypeName) => {
        const amount = aggregatedPile[cardTypeName];
  
        return `
          <div class="card">
            <div class="card-title">
                ${cardTypeName}: ${amount * Config.difficultyLevel}
            </div>
          </div>
        `;
      }).join('')}
    `;
  }

  return `
    <p class="difficulty-indicator">Difficulty: ${Config.difficultyLevel}</p>
    <div class="card">
      <div class="card-title">
          ${currentCard.cardType?.name}: ${currentCard.name}<br/>
      </div>
      <p>Amount: ${currentCard.points * Config.difficultyLevel}</p>
    </div>
  `;
};