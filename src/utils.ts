export const cleanHtmlString = (html: string) => {
    return html.replace(/\n|\r|\t/gi, '').trim();
};