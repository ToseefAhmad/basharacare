module.exports = {
    theme: {
        colors: {
            transparent: {
                DEFAULT: 'transparent'
            },
            black: {
                DEFAULT: '#000000',
                paragraph: '#666666',
                20: 'rgba(0, 0, 0, 0.2)'
            },
            grey: {
                dark: '#5c5c5c',
                DEFAULT: '#787878',
                lightest: '#e5e5e5',
                lighter: '#cccccc',
                lighter2: '#efefee',
                light: '#999999',
                'light-border': '#f2f2f2',
                border: '#cccccc',
                border2: '#BFBFBE'
            },
            purple: {
                DEFAULT: '#AC9FE7',
                lighter: '#D9D4EE',
                border: '#7B61FF',
                darker: '#A7A0C8',
                lightest: '#D9D4EE'
            },
            white: {
                DEFAULT: '#FFFFFF',
                loadingContainer: '#fcfcfc'
            },
            red: {
                DEFAULT: '#EB5757',
                pinterest: '#cb2027',
                error: '#eb5757'
            },
            brown: {
                DEFAULT: '#B48A86',
                light: '#F9ECE5'
            },
            blue: {
                DEFAULT: '#D8E7F4',
                facebook: '#3b5998',
                twitter: '#1da1f2',
                light: '#98C5E8',
                lightest: '#D8E7F4'
            },
            green: {
                whatsapp: '#4dc247'
            },
            cream: {
                DEFAULT: '#f7f1de'
            },
            yellow: {
                dark: '#6f5f2f'
            },
            orange: {
                storeCredits: '#f7a885'
            },
            category: {
                body: '#D8E7F4',
                hair: '#D9D4EE',
                face: '#F9ECE5'
            }
        },
        fontFamily: {
            sans: ['Proxima Nova', 'Tajawal', 'sans-serif'],
            headingBold: ['Albra'],
            albraSemibold: ['Albra-Semibold']
        },
        container: {
            screens: {},
            center: true
        },
        stroke: {
            current: 'currentColor'
        },
        extend: {
            screens: {
                maxMobile: { max: '375px' },
                xxxxs: '400px',
                mobile: { min: '280px', max: '500px' },
                xxxs: '500px',
                xxs: { min: '500px', max: '767px' },
                xs: '600px',
                '2sm': '769px',
                '3sm': '836px',
                '3md': '984px',
                largeTablet: '900px',
                smallDesktop: '1060px',
                desktop: '1240px'
            },
            fontSize: {
                xxxs: ['0.5rem', { lineHeight: '0.75rem' }], // 8px
                xxs: ['0.625rem', { lineHeight: '1rem' }], // 10px
                xs: ['0.75rem', { lineHeight: '1.25rem' }], // 12px
                menu: ['0.8125rem', { lineHeight: '1.3125rem' }], // 13px
                sm: ['0.875rem', { lineHeight: '1.488rem' }], // 14px
                base: ['1rem', { lineHeight: '2rem' }], // 16px
                lg: ['1.125rem', { lineHeight: '2rem' }], // 18px
                xl: ['1.25rem', { lineHeight: '1.625rem' }], // 20px
                '2xl': ['1.375rem', { lineHeight: '1.625rem' }], // 22px
                '2.5xl': ['1.5rem', { lineHeight: '2.25rem' }], // 24px
                '2.7xl': ['1.625rem', { lineHeight: '2.85rem' }], // 26px
                '3xl': ['1.875rem', { lineHeight: '2.345rem' }], // 30px
                '3.8xl': ['2.375rem', { lineHeight: '2.6125rem' }], // 38px
                '4xl': ['2.5rem', { lineHeight: '3rem' }], // 40px
                '5xl': ['3.75rem', { lineHeight: '5.125rem' }] // 60px
            },
            flex: {
                '50': '1 50%',
                '100': '100%'
            },
            height: {
                min: 'min-content'
            },
            spacing: {
                mobile: '1.125rem',
                '0.5': '0.125rem', // 2px
                '1.25': '0.3125rem', // 5px
                '1.3': '0.375rem', // 6px
                '1.4': '0.5rem', // 8px
                '1.5': '0.5625rem', // 9px
                '3.5': '0.9375rem', // 15px
                '4.5': '1.125rem', // 18px
                '5.5': '1.375rem', // 22px
                '6.5': '1.625rem', // 26px
                '7': '1.750rem', // 28px
                '7.5': '1.875rem', // 30px
                '12.5': '3.125rem', // 50px
                '14': '3.5rem', // 56px
                '14.5': '3.625rem', // 58px
                '15': '3.75rem', // 60px
                '17': '4.375rem', // 70px
                '18': '4.5rem', // 72px
                '21': '5.25rem', // 84px
                '22': '5.625rem', // 90px
                '25': '6.25rem', // 100px
                '67.5': '16.875rem', // 270px
                '27': '6.875rem', // 110px
                '29': '7.25rem', // 116px
                '30': '7.5rem', // 120px
                '32.5': '8.125rem', // 130px
                '35': '8.75rem', // 140px
                '37': '9.375rem', // 150px
                '45': '11.25rem', // 180px
                '62': '15.5rem', // 248px
                '65': '16.250rem', // 260px
                '75': '18.75rem', // 300px
                '83': '20.75rem', // 332px
                '90': '22.5rem', // 360px
                '120': '30rem', // 480px
                '160': '40rem', // 640px
                '250': '62.5rem', // 1000px
                '310': '77.5rem', // 1240px
                fit: 'fit-content'
            },
            letterSpacing: {
                '1px': '1px'
            },
            lineHeight: {
                '0': '0',
                'extra-loose': '2.5',
                '6.5': '1.6875rem', // 27px
                '12': '3rem' // 48px
            },
            borderRadius: {
                '5px': '0.3125rem',
                '4xl': '30px',
                circle: '50%'
            },
            maxWidth: {
                '100width': '100vw',
                desktop: '1240px'
            },
            maxHeight: {
                none: 'none'
            },
            minHeight: {
                '5': '1.25rem', // 20px
                '15': '3.75rem', // 60px
                '22.5': '5.625rem' // 90px
            },
            minWidth: {
                '5': '1.25rem', // 20px
                '24': '6rem'
            },
            scale: {
                invertX: -1
            },
            borderWidth: {
                '1.5': '1.5px'
            },
            gridTemplateColumns: {
                footerMD: '97% 3%',
                footer: '60% 40%',
                frAuto: '1fr auto',
                orderItems: '30% 30% repeat(2, 1fr)',
                auto1fr: 'auto 1fr'
            },
            gridTemplateRows: {
                footer: 'auto auto'
            },
            backgroundPosition: {
                'newsletter-ltr': '200px 0px',
                'newsletter-rtl': '600px 0px'
            },
            objectPosition: {
                'center-top': 'center top'
            },
            translate: {
                reverse: '-100%'
            },
            zIndex: {
                '1': '1'
            },
            textUnderlineOffset: {
                8: '8px'
            }
        }
    },
    variants: {
        display: ['hover'],
        zIndex: ['hover'],
        placeholderOpacity: ['focus']
    }
};
