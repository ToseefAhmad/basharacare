/**
 * Helper function for onClick() HTML Events
 *
 * @param {object} history history object
 * @param {function} history.push Pushes a new entry onto the history stack
 * @param {Event} event
 * @param currentStoreCode
 * @param html
 */
const handleHtmlContentClick = (history, event, currentStoreCode) => {
    const { code, target, type } = event;
    // Check if element is clicked or using accepted keyboard event
    const shouldIntercept = type === 'click' || code === 'Enter' || code === 'Space';

    // Intercept link clicks and check to see if the destination is internal to avoid refreshing the page
    if (target.tagName === 'A' && shouldIntercept) {
        event.preventDefault();

        const eventOrigin = event.view.location.origin;

        const { origin: linkOrigin, pathname: path, target: tabTarget, href } = target;

        if (tabTarget && globalThis.open) {
            globalThis.open(href, '_blank');
        } else if (linkOrigin === eventOrigin) {
            // Modifying the links
            const regExp = new RegExp('^\\/' + currentStoreCode + '\\/?|$');
            const adjustPath = path.replace(regExp, '/');

            history.push(adjustPath);
        } else {
            globalThis.location.assign(href);
        }
    }
};

export default handleHtmlContentClick;
