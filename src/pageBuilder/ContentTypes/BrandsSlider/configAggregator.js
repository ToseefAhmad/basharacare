export default node => {
    return {
        linkPath: node.dataset.linkPath,
        showItems: +node.dataset.showItems
    };
};
