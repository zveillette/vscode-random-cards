import { Card } from "../deck/deck";
import DifficultyIndicatorView from "./DifficultyIndicatorView";
import IconView from "./IconView";

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

    getPileClass(pile: Card[]) {
        if (pile.length <= 1) {
            return '';
        }

        if (pile.length > 3) {
            return 'pile-many';
        }

        return `pile-${pile.length}`;
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
            <div class="card">
            ${Object.keys(aggregatedPile).map((cardTypeName) => {
                const amount = aggregatedPile[cardTypeName];

                return `
                        <div class="card-title">
                            ${cardTypeName}${useWeight ? ` <span class="card-weight">(x${weightByCardTypeName[cardTypeName]})</span>` : ''}:
                            ${this.calculateAmount(amount, weightByCardTypeName[cardTypeName])}
                        </div>
                    `;
            }).join('')}
            </div>
            `;
        }

        if (currentCard) {
            const useIcon = !!currentCard.cardType?.icon;

            return `
                ${new DifficultyIndicatorView({ difficultyLevel }).renderHtml()}
                <div class="card ${this.getPileClass(pile || [])}">
                    <div class="card-title">
                ${useIcon ?
                    `${new IconView({ name: currentCard?.cardType?.icon || '', title: currentCard?.cardType?.name, size: "1.5rem" }).renderHtml()} ${currentCard.name}`
                    :
                    currentCard?.cardType?.name ? `${currentCard?.cardType?.name}: ${currentCard.name}` : currentCard.name
                }
                    </div>
                    <div class="card-pts">
                        ${this.calculateAmount(currentCard.points, currentCard.cardType?.weight)}
                        ${useWeight ? `<span class="card-weight">${currentCard.cardType?.weight || 1} x ${currentCard.points}</span>` : ''}
                    </div>
                    <div class="card-title align-right">
                ${useIcon ?
                    `${currentCard.name} ${new IconView({ name: currentCard?.cardType?.icon || '', title: currentCard?.cardType?.name, size: "1.5rem" }).renderHtml()}`
                    :
                    currentCard?.cardType?.name ? `${currentCard?.cardType?.name}: ${currentCard.name}` : currentCard.name
                }
                    </div>
                </div>
            `;
        }

        return '';
    }
}
