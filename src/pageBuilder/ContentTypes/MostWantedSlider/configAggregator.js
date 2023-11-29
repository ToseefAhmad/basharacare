export default node => {
    const mostWantedTitle = node.querySelector("[data-element='mostwanted']").textContent;
    return {
        mostWantedTitle
    };
};
