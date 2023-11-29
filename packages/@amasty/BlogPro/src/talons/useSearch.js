import { useCallback, useRef } from 'react';
import { useFormApi } from 'informed';
import { useHistory } from 'react-router-dom';

const initialValues = { search_query: '' };

export const useSearch = () => {
  const inputRef = useRef();
  const history = useHistory();
  const { push } = history;

  const formApi = useFormApi();

  const resetForm = useCallback(() => {
    formApi.reset();
  }, [formApi]);

  const handleSubmit = useCallback(
    ({ search_query }) => {
      if (search_query != null && search_query.trim().length > 0) {
        push(`/blog/search?query=${search_query}`);
      }
    },
    [push]
  );

  return {
    handleSubmit,
    inputRef,
    resetForm,
    initialValues
  };
};
