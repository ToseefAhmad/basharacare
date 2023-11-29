// Debounce a function call to the trailing edge.
// The debounced function returns a promise.
export default (func, wait) => {
    let lastTimeout = null;

    return function(...args) {
        const that = this;
        return new Promise((resolve, reject) => {
            if (lastTimeout) {
                clearTimeout(lastTimeout);
            }
            lastTimeout = setTimeout(() => {
                lastTimeout = null;
                Promise.resolve(func.apply(that, args))
                    .then(resolve)
                    .catch(reject);
            }, wait);
        });
    };
};
