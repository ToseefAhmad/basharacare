const targets = {
    prod: [
        '> 0.05%',
        'not dead',
        'not android <= 4.4.3',
        'not chrome <= 76',
        'not firefox <= 52',
        'not ios <= 10.3',
        'not safari <= 12',
        'not samsung <= 13'
    ]
}

module.exports = {
    plugins: ['@babel/plugin-proposal-optional-chaining', 'lodash'],
    presets: [['@magento/peregrine', { modules: false, targets }]]
};
