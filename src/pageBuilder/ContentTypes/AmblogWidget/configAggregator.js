export default node => {
    const amBlogWidget = node.querySelector('.amblog-widget-container');
    return {
        type: amBlogWidget.dataset.type,
        title: amBlogWidget.dataset.title,
        widgetId: +amBlogWidget.dataset.widgetId
    };
};
