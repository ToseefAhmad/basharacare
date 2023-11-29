export default node => {
    const newArrivalsTitle = node.querySelector("[data-element='title']").textContent;
    return {
        newArrivalsTitle
    };
};
