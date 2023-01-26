export const cleanHtmlString = (html: string) => {
    return html.replace(/\n|\r|\t/gi, '').replace(/ {2,}/g,' ').trim();
};