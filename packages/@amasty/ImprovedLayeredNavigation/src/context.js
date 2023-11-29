import { useQuery } from '@apollo/client';
import React, { createContext, useContext } from 'react';
import { useIntl } from 'react-intl';

import { BrowserPersistence } from '@magento/peregrine/lib/util';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './talons/config.gql';
const storage = new BrowserPersistence();

const AmIlnContext = createContext();
const { Provider } = AmIlnContext;

const AmIlnContextProvider = props => {
  const { children } = props;
  const { locale } = useIntl();

  const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
  const { getIlnConfigQuery } = operations;

  const { data: storeConfigData } = useQuery(getIlnConfigQuery, {
    fetchPolicy: 'cache-only'
  });

  const { storeConfig } = storeConfigData || {};
  const { default_display_currency_code } = storeConfig || {};

  const contextValue = {
    ...storeConfig,
    locale,
    currencyCode:
      storage.getItem('store_view_currency') ||
      default_display_currency_code ||
      'USD'
  };

  return <Provider value={contextValue}>{children}</Provider>;
};

export default AmIlnContextProvider;

export const useAmIlnContext = () => useContext(AmIlnContext);
