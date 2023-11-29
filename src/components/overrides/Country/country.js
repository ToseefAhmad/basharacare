import { func, shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import Field from '@app/components/overrides/Field';
import Select from '@app/components/overrides/Select';
import { useCountry } from '@magento/peregrine/lib/talons/Country/useCountry';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { GET_COUNTRIES_QUERY } from '@magento/venia-ui/lib/components/Country/country.gql';

import defaultClasses from './country.module.css';

const Country = props => {
    const talonProps = useCountry({
        queries: {
            getCountriesQuery: GET_COUNTRIES_QUERY
        }
    });
    const { countries, loading } = talonProps;
    const { classes: propClasses, field, label, translationId, ...inputProps } = props;
    const intl = useIntl();

    const classes = useStyle(defaultClasses, propClasses);
    const selectProps = {
        classes,
        disabled: loading,
        field,
        items: countries,
        ...inputProps
    };

    return (
        <Field
            id={classes.root}
            label={intl.formatMessage({
                /* Intl-messages-tool is-exported */
                id: translationId,
                defaultMessage: label
            })}
            classes={{ label: classes.fieldLabel, root: classes.root }}
        >
            <Select {...selectProps} id={classes.root} />
        </Field>
    );
};

export default Country;

Country.defaultProps = {
    field: 'country',
    label: 'Country',
    translationId: 'global.country'
};

Country.propTypes = {
    classes: shape({
        root: string
    }),
    field: string,
    label: string,
    translationId: string,
    validate: func,
    initialValue: string
};
