export const scrollIntoViewWithOffset = (element, offset) => {
    window.scrollTo({
        top: element.getBoundingClientRect().top - document.body.getBoundingClientRect().top - offset
    });
};
