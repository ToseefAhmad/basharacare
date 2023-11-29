export const toCamelCase = string => {
    return string.replace(/-([a-z])/g, (match, capture) => capture.toUpperCase());
};
