import { useQuery } from '@apollo/client';
import { useFieldState, useFieldApi } from 'informed';
import { useMemo, useEffect, useRef } from 'react';
import { useIntl } from 'react-intl';

import { GET_CITIES_FOR_COUNTRY } from './city.gql';

export const useCity = ({ countryField, cityFieldName }) => {
    const { value: country } = useFieldState(countryField);
    const { locale } = useIntl();
    const initialSet = useRef(false);

    const { data: cityData, loading } = useQuery(GET_CITIES_FOR_COUNTRY, {
        skip: !country,
        variables: {
            country,
            locale
        }
    });

    const cityOptions = useMemo(() => {
        return [...new Set(cityData?.getCountryCities)]
            ?.slice()
            ?.sort()
            .map(city => ({
                value: city,
                label: city
            }));
    }, [cityData]);

    const cityField = useFieldApi(cityFieldName);

    const cityFieldEmpty = cityField.getValue() === undefined;

    useEffect(() => {
        if (cityOptions.length && cityFieldEmpty && !initialSet?.current) {
            cityField.setValue(cityOptions[0].value);
            initialSet.current = true;
        }
    }, [cityOptions, cityField, cityFieldEmpty, initialSet]);

    return {
        cityOptions,
        loading
    };
};
