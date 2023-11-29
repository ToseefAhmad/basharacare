import React from 'react';
import { Loader as LoaderIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import Field from '../overrides/Field';
import Select from '../overrides/Select';
import TextInput from '../overrides/TextInput';

import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './city.module.css';
import { useCity } from './useCity';

const City = ({ countryField, selectClasses, ...props }) => {
    const { cityOptions, loading } = useCity({
        countryField,
        cityFieldName: props.field
    });
    const { formatMessage } = useIntl();

    return (
        <div className={classes.root}>
            <Field
                id="city"
                label={formatMessage({
                    id: 'global.city',
                    defaultMessage: 'City'
                })}
                classes={selectClasses}
            >
                {loading && (
                    <div className={classes.loading}>
                        <Icon src={LoaderIcon} size={20} classes={{ icon: classes.indicator }} />{' '}
                    </div>
                )}
                {(cityOptions && cityOptions.length > 0 && (
                    <>
                        <Select {...props} classes={selectClasses} items={cityOptions} />
                    </>
                )) || <TextInput {...props} />}
            </Field>
        </div>
    );
};

export default City;
