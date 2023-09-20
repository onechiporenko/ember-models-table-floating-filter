import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { isBlank, isNone } from '@ember/utils';
import { EmberRunTimer } from '@ember/runloop/types';
import { cancel, debounce } from '@ember/runloop';
import { RowFilteringCellArgs } from 'ember-models-table/interfaces/components/models-table/themes/default/row-filtering-cell-args.interface';
import { SelectOption } from 'ember-models-table/interfaces/select-option.interface';
import { ModelsTableDataItem } from 'ember-models-table/types/models-table-data-item.type';

export interface FloatingFilterArgs extends RowFilteringCellArgs {
  clearColumnFilter: (e: Event) => boolean;
}

export interface FloatingFilterListOption extends SelectOption {
  checked: boolean;
}

export enum FloatingFilterType {
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  LIST = 'LIST',
}

export enum FilterType {
  RANGE = 'RANGE',
  GT = 'GT',
  GTE = 'GTE',
  LT = 'LT',
  LTE = 'LTE',
  EQ = 'EQ',
  NEQ = 'NEQ',
  STARTS_WITH = 'STARTS_WITH',
  NOT_STARTS_WITH = 'NOT_STARTS_WITH',
  ENDS_WITH = 'ENDS_WITH',
  NOT_ENDS_WITH = 'NOT_ENDS_WITH',
  CONTAINS = 'CONTAINS',
  NOT_CONTAINS = 'NOT_CONTAINS',
  BLANK = 'BLANK',
  NOT_BLANK = 'NOT_BLANK',
  LIST = 'LIST',
}

export class ListFilterOption {
  @tracked declare value: string | number | boolean;
  @tracked declare label: string | number | boolean;
  @tracked declare checked: boolean;
}

export interface FloatingFilterOptions {
  floatingFilterType: FloatingFilterType;
}

export const columnListFloatingFilterFunction = (
  cellValue: string,
  floatingFilterValue: string,
  row: ModelsTableDataItem,
): boolean => {
  floatingFilterValue = floatingFilterValue || '{}';
  const { args } = JSON.parse(floatingFilterValue);
  const arg0 = args[0] || [];
  return arg0.includes(cellValue);
};

export const columnNumberFloatingFilterFunction = (
  cellValue: string,
  floatingFilterValue: string,
  row: ModelsTableDataItem,
): boolean => {
  floatingFilterValue = floatingFilterValue || '{}';
  const { type, args } = JSON.parse(floatingFilterValue);
  const numericCellValue = Number(cellValue);
  const arg0Num = args?.length ? Number(args[0]) : -Infinity;
  const arg1Num = args?.length > 1 ? Number(args[1]) : Infinity;
  switch ((type || '').toUpperCase()) {
    case FilterType.RANGE: {
      return numericCellValue <= arg1Num && numericCellValue >= arg0Num;
    }
    case FilterType.EQ: {
      return numericCellValue === arg0Num;
    }
    case FilterType.NEQ: {
      return numericCellValue !== arg0Num;
    }
    case FilterType.GTE: {
      return numericCellValue >= arg0Num;
    }
    case FilterType.GT: {
      return numericCellValue > arg0Num;
    }
    case FilterType.LT: {
      return numericCellValue < arg0Num;
    }
    case FilterType.LTE: {
      return numericCellValue <= arg0Num;
    }
  }
  return true;
};

export const columnStringFloatingFilterFunction = (
  cellValue: string,
  floatingFilterValue: string,
  row: ModelsTableDataItem,
): boolean => {
  floatingFilterValue = floatingFilterValue || '{}';
  const { type, args } = JSON.parse(floatingFilterValue);
  const strCellValue = String(cellValue);
  const arg0Str = args?.length ? String(args[0]) : '';
  switch ((type || '').toUpperCase()) {
    case FilterType.EQ: {
      return strCellValue === arg0Str;
    }
    case FilterType.NEQ: {
      return strCellValue !== arg0Str;
    }
    case FilterType.CONTAINS: {
      return strCellValue.includes(arg0Str);
    }
    case FilterType.NOT_CONTAINS: {
      return !strCellValue.includes(arg0Str);
    }
    case FilterType.NOT_STARTS_WITH: {
      return strCellValue.indexOf(arg0Str) !== 0;
    }
    case FilterType.STARTS_WITH: {
      return strCellValue.indexOf(arg0Str) === 0;
    }
    case FilterType.BLANK: {
      return isBlank(strCellValue);
    }
    case FilterType.NOT_BLANK: {
      return !isBlank(strCellValue);
    }
    case FilterType.ENDS_WITH: {
      return (
        strCellValue.indexOf(arg0Str, strCellValue.length - arg0Str.length) !==
        -1
      );
    }
    case FilterType.NOT_ENDS_WITH: {
      return (
        strCellValue.indexOf(arg0Str, strCellValue.length - arg0Str.length) ===
        -1
      );
    }
  }
  return true;
};

export default class FloatingFilter extends Component<FloatingFilterArgs> {
  @tracked
  protected FilterType = FilterType;

  @tracked
  protected filterType = FilterType.EQ;

  @tracked
  protected filterArgsFirst = null;

  @tracked
  protected filterArgsSecond = null;

  @tracked
  protected listFilterOptions: FloatingFilterListOption[] = [];

  @tracked
  protected filterForListFilterOptions = '';

  @tracked
  dropdownShown = false;

  @tracked
  declare timer: EmberRunTimer;

  protected get filterIcon(): string {
    return this.getThemeKeyValue(
      'floatingFilter',
      'Icon',
      'fa fa-fw fa-filter',
    );
  }

  protected get filters(): SelectOption[] {
    return this.isNumberFilterType ? this.numberFilters : this.stringFilters;
  }

  protected get argsInputType(): string {
    return this.isNumberFilterType ? 'number' : 'string';
  }

  protected get showFirstArgInput(): boolean {
    return (
      this.filterType !== FilterType.BLANK &&
      this.filterType !== FilterType.NOT_BLANK
    );
  }

  protected get showSecondArgInput(): boolean {
    return this.showFirstArgInput && this.filterType === FilterType.RANGE;
  }

  protected get numberFilters(): SelectOption[] {
    return [
      {
        label: this.getFilterLabel(FilterType.RANGE, 'In range'),
        value: FilterType.RANGE,
      },
      {
        label: this.getFilterLabel(FilterType.EQ, 'Equals'),
        value: FilterType.EQ,
      },
      {
        label: this.getFilterLabel(FilterType.NEQ, 'Not equal'),
        value: FilterType.NEQ,
      },
      {
        label: this.getFilterLabel(FilterType.GT, 'Greater than'),
        value: FilterType.GT,
      },
      {
        label: this.getFilterLabel(FilterType.GTE, 'Greater than or equals'),
        value: FilterType.GTE,
      },
      {
        label: this.getFilterLabel(FilterType.LT, 'Less than'),
        value: FilterType.LT,
      },
      {
        label: this.getFilterLabel(FilterType.LTE, 'Less than or equals'),
        value: FilterType.LTE,
      },
    ];
  }

  protected get stringFilters(): SelectOption[] {
    return [
      {
        label: this.getFilterLabel(FilterType.EQ, 'Equals'),
        value: FilterType.EQ,
      },
      {
        label: this.getFilterLabel(FilterType.NEQ, 'Not equal'),
        value: FilterType.NEQ,
      },
      {
        label: this.getFilterLabel(FilterType.STARTS_WITH, 'Starts with'),
        value: FilterType.STARTS_WITH,
      },
      {
        label: this.getFilterLabel(
          FilterType.NOT_STARTS_WITH,
          'Not starts with',
        ),
        value: FilterType.NOT_STARTS_WITH,
      },
      {
        label: this.getFilterLabel(FilterType.ENDS_WITH, 'Ends with'),
        value: FilterType.ENDS_WITH,
      },
      {
        label: this.getFilterLabel(FilterType.NOT_ENDS_WITH, 'Not ends with'),
        value: FilterType.NOT_ENDS_WITH,
      },
      {
        label: this.getFilterLabel(FilterType.CONTAINS, 'Contains'),
        value: FilterType.CONTAINS,
      },
      {
        label: this.getFilterLabel(FilterType.NOT_CONTAINS, 'Not contains'),
        value: FilterType.NOT_CONTAINS,
      },
      {
        label: this.getFilterLabel(FilterType.BLANK, 'Blank'),
        value: FilterType.BLANK,
      },
      {
        label: this.getFilterLabel(FilterType.NOT_BLANK, 'Not blank'),
        value: FilterType.NOT_BLANK,
      },
    ];
  }

  protected get filtersHumanReadable(): string {
    const { type, args } = JSON.parse(this.args.column.filterString || '{}');
    if (!args || (isNone(args[0]) && this.showFirstArgInput)) {
      return '';
    }
    switch (type) {
      case FilterType.RANGE: {
        return `${args[0]} - ${args[1]}`;
      }
      case FilterType.EQ: {
        return `= ${args[0]}`;
      }
      case FilterType.NEQ: {
        return `!= ${args[0]}`;
      }
      case FilterType.GTE: {
        return `>= ${args[0]}`;
      }
      case FilterType.GT: {
        return `> ${args[0]}`;
      }
      case FilterType.LTE: {
        return `<= ${args[0]}`;
      }
      case FilterType.LT: {
        return `< ${args[0]}`;
      }
      case FilterType.STARTS_WITH: {
        return `^ ${args[0]}`;
      }
      case FilterType.NOT_STARTS_WITH: {
        return `!^ ${args[0]}`;
      }
      case FilterType.ENDS_WITH: {
        return `${args[0]} $`;
      }
      case FilterType.NOT_ENDS_WITH: {
        return `${args[0]} !$`;
      }
      case FilterType.CONTAINS: {
        return `+ ${args[0]}`;
      }
      case FilterType.NOT_CONTAINS: {
        return `- ${args[0]}`;
      }
      case FilterType.BLANK: {
        return '""';
      }
      case FilterType.NOT_BLANK: {
        return '!""';
      }
      case FilterType.LIST: {
        return `Any of (${args[0].length}) ${args[0].join(', ')}`;
      }
    }
    return '';
  }

  protected get floatingFilterOptions(): FloatingFilterOptions {
    return (this.args.column.originalDefinition['emt-addons']?.floatingFilter ??
      {}) as FloatingFilterOptions;
  }

  protected get isNumberFilterType(): boolean {
    return (
      this.floatingFilterOptions.floatingFilterType ===
      FloatingFilterType.NUMBER
    );
  }

  protected get isListFilterType(): boolean {
    return (
      this.floatingFilterOptions.floatingFilterType === FloatingFilterType.LIST
    );
  }

  protected get filteredListFilterOptions(): FloatingFilterListOption[] {
    if (!this.filterForListFilterOptions) {
      return this.listFilterOptions;
    }
    return this.listFilterOptions.filter((opt) =>
      `${opt.value}`.includes(this.filterForListFilterOptions),
    );
  }

  protected get selectIcon(): string {
    return this.getThemeKeyValue(
      'SelectAll',
      'Icon',
      'fa fa-fw fa-check-square-o',
    );
  }

  protected get deselectIcon(): string {
    return this.getThemeKeyValue('DeselectAll', 'Icon', 'fa fa-fw fa-square-o');
  }

  protected get applyFilterButtonText(): string {
    return this.getFilterLabel('ApplyFilter', 'Apply');
  }

  protected get closeFilterButtonText(): string {
    return this.getFilterLabel('CloseFilter', 'Close');
  }

  protected get selectAllListFilterOptionsButtonText(): string {
    return this.getFilterLabel('SelectAllListFilterOptions', 'Select All');
  }

  protected get deselectAllListFilterOptionsButtonText(): string {
    return this.getFilterLabel('DeselectAllListFilterOptions', 'Deselect All');
  }

  protected getFilterLabel(type: string, defaultLabel: string): string {
    return this.getThemeKeyValue(type, 'LabelMsg', defaultLabel);
  }

  protected getThemeKeyValue(
    key: string,
    type: string,
    defaultValue: string,
  ): string {
    const themeKey = `floatingFilter${key}${type}`;
    return (this.args.themeInstance[themeKey] as string) ?? defaultValue;
  }

  protected hideDropdown(): void {
    this.dropdownShown = false;
  }

  @action
  protected onToggleDropdown(): void {
    this.dropdownShown = !this.dropdownShown;
    cancel(this.timer);
  }

  @action
  protected onHoverDropdown(): void {
    cancel(this.timer);
  }

  @action
  protected onHideDropdown(): void {
    this.timer = debounce(this, this.hideDropdown, 500, false);
  }

  @action
  protected updateFilterListItem(
    opt: FloatingFilterListOption,
    e: Event,
  ): boolean {
    opt.checked = !opt.checked;
    e?.stopPropagation?.();
    e?.preventDefault?.();
    return false;
  }

  @action
  protected updateFilterTypeOnInit(): void {
    if (this.isListFilterType) {
      this.filterType = FilterType.LIST;
      this.listFilterOptions = (this.args.column.filterOptions || [])
        .filter((opt, index) => index !== 0)
        .map((opt) => {
          const fOpt = new ListFilterOption();
          fOpt.value = opt.value;
          fOpt.label = opt.label;
          fOpt.checked = true;
          return fOpt;
        });
    }
  }

  @action
  protected onUpdateColumnFilter(clb?: () => void): void {
    const args = [];
    if (this.isListFilterType) {
      args.push(
        this.listFilterOptions
          .filter((opt) => opt.checked)
          .map((opt) => opt.value),
      );
    }
    if (this.showFirstArgInput) {
      args.push(this.filterArgsFirst);
      if (this.showSecondArgInput) {
        args.push(this.filterArgsSecond);
      }
    }
    const filterString = JSON.stringify({
      type: this.filterType,
      args,
    });
    this.args.changeColumnFilter(filterString, this.args.column);
    if (typeof clb === 'function') {
      clb();
    }
    this.hideDropdown();
  }

  @action
  protected updateFilter(newFilterType: FilterType): void {
    this.filterType = newFilterType;
  }

  @action
  protected selectAllListFilterOptions(): void {
    this.listFilterOptions.forEach((opt) => (opt.checked = true));
  }

  @action
  protected deselectAllListFilterOptions(): void {
    this.listFilterOptions.forEach((opt) => (opt.checked = false));
  }
}
