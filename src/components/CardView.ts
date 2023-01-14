import { Card } from "../deck";
import { Config } from '../config';
import DifficultyIndicatorView from "./DifficultyIndicatorView";

type Props = {
  currentCard: Card;
  pile: Card[];
};

const calculateAmount = (amount: number, weight: number = 1) => {
  if(Config.useWeight) {
    return Math.ceil(amount * weight * Config.difficultyLevel);
  }

  return Math.ceil(amount * Config.difficultyLevel);
};

export default (props: Props) => {
  const { currentCard, pile } = props;

  if(Config.aggregatePile) {
    const weightByCardTypeName: Record<string, number> = {};
    const aggregatedPile = pile.reduce<Record<string, number>>((accumulator, card) => {
      if(!card.cardType) {
        return accumulator;
      }

      if(!accumulator[card.cardType.name]) {
        weightByCardTypeName[card.cardType.name] = card.cardType.weight || 1;
        accumulator[card.cardType.name] = 0;
      }
      accumulator[card.cardType.name] += card.points;

      return accumulator;
    },{});

    return `
      ${DifficultyIndicatorView()}
      ${Object.keys(aggregatedPile).map((cardTypeName) => {
        const amount = aggregatedPile[cardTypeName];
  
        return `
          <div class="card">
            <div class="card-title">
                ${cardTypeName}
                ${Config.useWeight ? ` (x${weightByCardTypeName[cardTypeName]})`: ''}:
                ${calculateAmount(amount, weightByCardTypeName[cardTypeName])}
            </div>
          </div>
        `;
      }).join('')}
    `;
  }

  return `
    ${DifficultyIndicatorView()}
    <div class="card">
      <div class="card-title">
          ${currentCard.cardType?.name}
          ${currentCard.name}<br/>
      </div>
      <p>
        Amount ${Config.useWeight ? ` (x${currentCard.cardType?.weight})`: ''}:
        ${calculateAmount(currentCard.points, currentCard.cardType?.weight)}
      </p>
    </div>
  `;
};