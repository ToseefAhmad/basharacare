import { gql } from '@apollo/client';

export const GET_CITIES_FOR_COUNTRY = gql`
    query GetCitiesForCountry($country: String, $locale: String) {
        getCountryCities(country: $country, locale: $locale)
    }
`;
