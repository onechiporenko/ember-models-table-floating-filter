import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import {
  FloatingFilterType,
  columnNumberFloatingFilterFunction,
  columnStringFloatingFilterFunction,
  columnListFloatingFilterFunction,
} from 'ember-models-table-floating-filter/components/models-table/themes/default/floating-filter';

export default class ExamplesSimpleController extends Controller {
  @service() fw;

  get model() {
    const ret = [];
    for (let i = 0; i < 30; i++) {
      const charCode = 65 + (i % 15);
      ret.push({
        id: i,
        chars:
          String.fromCharCode(charCode) + String.fromCharCode(charCode + 1),
      });
    }
    return ret;
  }

  columns = [
    {
      propertyName: 'id',
      title: 'ID',
      filterFunction: columnNumberFloatingFilterFunction,
      componentForFilterCell: this.fw.floatingFilterComponent,
      'emt-addons': {
        floatingFilter: {
          floatingFilterType: FloatingFilterType.NUMBER,
        },
      },
    },
    { propertyName: 'id', title: 'ID' },
    {
      propertyName: 'chars',
      title: 'C',
      filterFunction: columnStringFloatingFilterFunction,
      'emt-addons': {
        floatingFilter: {
          floatingFilterType: FloatingFilterType.STRING,
        },
      },
      componentForFilterCell: this.fw.floatingFilterComponent,
    },
    {
      propertyName: 'chars',
      title: 'D',
      filterWithSelect: true,
      filterFunction: columnListFloatingFilterFunction,
      'emt-addons': {
        floatingFilter: {
          floatingFilterType: FloatingFilterType.LIST,
        },
      },
      componentForFilterCell: this.fw.floatingFilterComponent,
    },
  ];
}
