import {
  clickable,
  collection,
  create,
  property,
  text,
  value,
} from 'ember-cli-page-object';
import { filterDefinition } from './models-table-bs';

export const definition = {
  filters: collection(
    'table thead tr:eq(1) th',
    Object.assign({}, filterDefinition, {
      filterInput: property('readonly', '.filter-wrapper input'),
      filterInputValue: value('.filter-wrapper input'),
      listFilterOptions: collection(
        '.list-filter-options-wrapper .checkbox-wrapper',
        {
          content: text(),
          click: clickable('input'),
        },
      ),
    }),
  ),
};

export default create(definition);
