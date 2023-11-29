module.exports = targets => {
    const { specialFeatures } = targets.of('@magento/pwa-buildpack');

    specialFeatures.tap(flags => {
        flags[targets.name] = {
            esModules: true,
            cssModules: true,
            graphqlQueries: true
        };
    });

    const paymentMethods = ['payfort_fort_cc', 'payfort_applepay', 'aps_fort_cc', 'aps_apple'];

    const { checkoutPagePaymentTypes } = targets.of('@magento/venia-ui');
    paymentMethods.map(method => {
        checkoutPagePaymentTypes.tap(payments =>
            payments.add({
                paymentCode: method,
                importPath: '@magebit/pwa-studio-payfortFortCc/src/components/Methods/' + method
            })
        );
    });
};
