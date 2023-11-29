const ALLOWED_PAYMENT_METHODS = [
    {
        paymentCode: 'tamara_pay_by_instalments',
        importPath: '@magebit/pwa-studio-tamara/src/components/installments.js'
    },
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
