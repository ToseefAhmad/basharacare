export const getFormattedValue = (value, type) => {
    switch (type) {
        case 'floor':
            return Math.floor(value);
        case 'ceil':
            return Math.ceil(value);
        case 'round':
            return Math.round(value);
        default:
            return value;
    }
};
