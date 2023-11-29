const rtlLanguages = {
    ar: 'Arabic',
    arc: 'Aramaic',
    dv: 'Dhivehi/Maldivian',
    ha: 'Hausa',
    he: 'Hebrew',
    ks: 'Kashmiri',
    khw: 'Khowar',
    ku: 'Kurdish',
    ps: 'Pashto',
    fa: 'Persian',
    ur: 'Urdu',
    yi: 'Yiddish'
};

export const isLanguageRtl = locale => {
    const [language] = locale ? locale.split('-') : ['en', 'GB'];
    return language in rtlLanguages;
};
