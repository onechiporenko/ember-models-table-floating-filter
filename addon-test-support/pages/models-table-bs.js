import {
  create,
  text,
  clickable,
  collection,
  isVisible,
  property,
  value,
  fillable,
} from 'ember-cli-page-object';

import { findOne } from 'ember-cli-page-object/extend';

export function isDisabled(selector, options = {}) {
  return {
    isDescriptor: true,
    get() {
      return findOne(this, selector, options).disabled;
    },
  };
}

export const filterDefinition = {
  content: text(),
  filterInput: property('readonly', '.filter-wrapper > input'),
  filterInputValue: value('.filter-wrapper > input'),
  clearFilter: clickable('.clearFilterIcon'),
  clearFilterExists: isVisible('.clearFilterIcon'),
  clearFilterDisabled: isDisabled('.clearFilterIcon'),
  dropdownToggleExists: isVisible('.floating-filter-dropdown-toggle'),
  dropdownToggle: clickable('.floating-filter-dropdown-toggle'),
  dropdownExists: isVisible('.float-filter-dropdown-menu'),
  filterTypeSelectExists: isVisible('.filter-type'),
  setFilterType: fillable('.filter-type select'),
  setFirstArg: fillable('.first-arg'),
  setSecondArg: fillable('.second-arg'),
  applyFilterExists: isVisible('.apply-filter'),
  applyFilter: clickable('.apply-filter'),
  listFilterOptionsExists: isVisible('.list-filter-options-wrapper'),
  listFilterOptions: collection('.list-filter-options-wrapper a', {
    content: text(),
  }),
  filterForListFilterOptions: fillable('.filter-list-options'),
  filterForListFilterOptionsExists: isVisible('.filter-list-options'),
  selectAllListFilterOptionsExists: isVisible('.select-all'),
  selectAllListFilterOptions: clickable('.select-all'),
  deselectAllListFilterOptionsExists: isVisible('.deselect-all'),
  deselectAllListFilterOptions: clickable('.deselect-all'),
};

export const definition = {
  scope: '.models-table-wrapper',
  filters: collection('table thead tr:eq(1) th', filterDefinition),
};

export default create(definition);
