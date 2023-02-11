type Props = {
    name: string,
    title?: string,
    size?: string
};

export default class IconView {
    constructor(public props: Props) { }

    renderHtml(): string {
        const { name, title, size } = this.props;

        return `
            <i class="icon codicon codicon-${name}" title="${title}" style="font-size: ${size || '16px'}; min-width: ${size}"></i>
        `;
    }
}
