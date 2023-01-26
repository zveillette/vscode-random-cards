import { Card } from "../deck/deck";

type Props = {
    pile: Card[]
};

export default class PileCounterView {
    constructor(public props: Props) { }

    renderHtml() {
        const { pile } = this.props;
        if (pile.length <= 1) {
            return '';
        }

        return `
            <div class="card-pile-count">x${pile.length}</div>
        `;
    }
}
