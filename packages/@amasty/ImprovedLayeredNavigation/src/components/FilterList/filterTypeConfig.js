import {
  getRatingTitle,
  getStockTitle,
  getRangeTitle,
  getIsNewTitle,
  getOnSaleTitle
} from '../../utils/titles';
import Category from '../Category';
import FromTo from '../FromTo';
import Label from '../Label';
import PriceSlider from '../PriceSlider';
import Rating from '../Rating';
import Swatch from '../Swatch';

import defaultClasses from './filterList.css';


export const filterTypeConfig = {
  Slider: {
    listComponent: PriceSlider,
    optionTitle: getRangeTitle
  },
  Ranges: {
    itemComponent: Label,
    optionTitle: getRangeTitle
  },
  Images: {
    itemComponent: Swatch,
    classes: { items: defaultClasses.swatchList }
  },
  'Text Swatches': {
    itemComponent: Swatch,
    classes: { items: defaultClasses.swatchList },
    textOnly: true
  },
  'Images & Labels': {
    itemComponent: Label
  },
  rating: {
    itemComponent: Rating,
    optionTitle: getRatingTitle
  },
  stock: {
    itemComponent: Label,
    optionTitle: getStockTitle
  },
  category_ids: {
    listComponent: Category
  },

  'From-To Only': {
    listComponent: FromTo,
    optionTitle: getRangeTitle
  },

  am_on_sale: {
    itemComponent: Label,
    optionTitle: getOnSaleTitle
  },
  am_is_new: {
    itemComponent: Label,
    optionTitle: getIsNewTitle
  }
};

export default filterTypeConfig;
