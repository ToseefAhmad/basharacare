export default node => {
    const trendingTitle = node.querySelector("[data-element='trendingslider']").textContent;
    return {
        trendingTitle
    };
};
