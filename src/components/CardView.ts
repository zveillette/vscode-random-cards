import { Card } from "../deck/deck";
import { Config } from '../state/config';
import DifficultyIndicatorView from "./DifficultyIndicatorView";

type Props = {
    currentCard: Card;
    pile: Card[];
};

const calculateAmount = (useWeight: boolean, difficultyLevel: number, amount: number, weight: number = 1) => {
    if(useWeight) {
        return Math.ceil(amount * weight * difficultyLevel);
    }

  return Math.ceil(amount * difficultyLevel);
};

export default (config: Config, props: Props) => {
    const { currentCard, pile } = props;

    if(config.aggregatePile) {
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
        ${DifficultyIndicatorView(config)}
        ${Object.keys(aggregatedPile).map((cardTypeName) => {
            const amount = aggregatedPile[cardTypeName];

            return `
            <div class="card">
                <div class="card-title">
                    ${cardTypeName}
                    ${config.useWeight ? ` (x${weightByCardTypeName[cardTypeName]})`: ''}:
                    ${calculateAmount(config.useWeight, config.difficultyLevel, amount, weightByCardTypeName[cardTypeName])}
                </div>
            </div>
            `;
        }).join('')}
        `;
    }

    return `
        ${DifficultyIndicatorView(config)}
        <div class="card">
        <div class="card-title">
            ${currentCard.cardType?.name}: ${currentCard.name}
        </div>
        <p>
            Amount ${config.useWeight ? ` (x${currentCard.cardType?.weight})`: ''}:
            ${calculateAmount(config.useWeight, config.difficultyLevel,currentCard.points, currentCard.cardType?.weight)}
        </p>
        </div>
    `;
};