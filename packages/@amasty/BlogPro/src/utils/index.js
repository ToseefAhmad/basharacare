import { useIntl } from 'react-intl';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { DATE_FORMAT } from '../constants';
import { dateToDistance } from "@app/util/date";

const mapItemsForTree = (items, itemKey, parentKey) =>
  new Map(
    items.map(item => [
      Number(item[itemKey]),
      {
        ...item,
        [itemKey]: Number(item[itemKey]),
        [parentKey]: item[parentKey] ? Number(item[parentKey]) : null
      }
    ])
  );

export const buildTree = props => {
  const {
    items = [],
    parentKey = 'parent_id',
    itemKey = 'category_id'
  } = props;

  const map = mapItemsForTree(items, itemKey, parentKey);

  for (const item of map.values()) {
    if (!map.has(item[parentKey])) {
      continue;
    }

    const parent = map.get(item[parentKey]);
    parent.children = [...(parent.children || []), item];
  }

  return [...map.values()].filter(item => !item[parentKey]);
};

export const getURL = (section = 'blog', urlKey = '') =>
  resourceUrl(`${section}/${urlKey}`.replace(/\s+/g, ''));

export const getStrippedText = (str = '', size = 300) => {
  return str && str.length > size
    ? `${str.replace(/<[^>]+>/g, '').slice(0, size)}...`
    : str;
};

export const formatDate = (date, format = DATE_FORMAT.PASSED) => {
  const { locale } = useIntl();

  return format.toUpperCase() === DATE_FORMAT.PASSED
    ? dateToDistance(date, locale)
    : date;
};
