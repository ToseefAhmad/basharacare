const ALLOWED_PAYMENT_METHODS = [
    {
        paymentCode: 'tabby_installments',
        importPath: '@magebit/pwa-studio-tabby/src/components/installments.js'
    },
    {
        paymentCode: 'tabby_checkout',
        importPath: '@magebit/pwa-studio-tabby/src/components/payLater.js'
    }
];

module.exports = targets => {
    const { specialFeatures } = targets.of('@magento/pwa-buildpack');
    specialFeatures.tap(flags => {
        flags[targets.name] = {
            esModules: true,
            cssModules: true,
            graphqlQueries: true
        };
    });

    const { checkoutPagePaymentTypes } = targets.of('@magento/venia-ui');

    checkoutPagePaymentTypes.tap(payments => {
        ALLOWED_PAYMENT_METHODS.forEach(method => {
            payments.add(method);
        });
    });
};
