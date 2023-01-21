import { Card } from "../deck/deck";
import DifficultyIndicatorView from "./DifficultyIndicatorView";

type Props = {
    aggregatePile?: boolean,
    useWeight?: boolean,
    difficultyLevel: number,
    currentCard?: Card;
    pile?: Card[];
};

export default class CardView {
    constructor(public props: Props) { }

    calculateAmount(amount: number, weight: number = 1) {
        const { useWeight, difficultyLevel } = this.props;
        if (useWeight) {
            return Math.ceil(amount * weight * difficultyLevel);
        }

        return Math.ceil(amount * difficultyLevel);
    }

    renderHtml(): string {
        const { aggregatePile, useWeight, difficultyLevel, currentCard, pile } = this.props;

        if (aggregatePile) {
            const weightByCardTypeName: Record<string, number> = {};
            const aggregatedPile = (pile || []).reduce<Record<string, number>>((accumulator, card) => {
                if (!card.cardType) {
                    return accumulator;
                }

                if (!accumulator[card.cardType.name]) {
                    weightByCardTypeName[card.cardType.name] = card.cardType.weight || 1;
                    accumulator[card.cardType.name] = 0;
                }
                accumulator[card.cardType.name] += card.points;

                return accumulator;
            }, {});

            return `
            ${new DifficultyIndicatorView({ difficultyLevel }).renderHtml()}
            ${Object.keys(aggregatedPile).map((cardTypeName) => {
                const amount = aggregatedPile[cardTypeName];

                return `
                <div class="card">
                    <div class="card-title">
                        ${cardTypeName}${useWeight ? ` (x${weightByCardTypeName[cardTypeName]})` : ''}:
                        ${this.calculateAmount(amount, weightByCardTypeName[cardTypeName])}
                    </div>
                </div>
                `;
            }).join('')}
            `;
        }

        if (currentCard) {
            return `
                ${new DifficultyIndicatorView({ difficultyLevel }).renderHtml()}
                <div class="card">
                    <div class="card-title">
                        ${currentCard.cardType ? currentCard.cardType.name + ':' : ''} ${currentCard.name}
                    </div>
                    <p>
                        Amount ${useWeight ? `(x${currentCard.cardType?.weight || 1})` : ''}:
                        ${this.calculateAmount(currentCard.points, currentCard.cardType?.weight)}
                    </p>
                </div>
            `;
        }

        return '';
    }
}
