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

  model = [
    { a: 1, b: 1, c: 'a', d: 'aaaaaaaaaaaaaaaaaaaaaa' },
    { a: 2, b: 2, c: 'b', d: 'b' },
    { a: 3, b: 3, c: 'c', d: 'c' },
    { a: 4, b: 4, c: 'd', d: 'd' },
    { a: 5, b: 5, c: 'e', d: 'e' },
    { a: 6, b: 6, c: 'f', d: 'f' },
    { a: 7, b: 7, c: 'g', d: 'g' },
    { a: 8, b: 8, c: 'h', d: 'h' },
  ];

  columns = [
    {
      propertyName: 'a',
      title: 'A',
      filterFunction: columnNumberFloatingFilterFunction,
      floatingFilterType: FloatingFilterType.NUMBER,
      componentForFilterCell: this.fw.floatingFilterComponent,
    },
    { propertyName: 'b', title: 'B' },
    {
      propertyName: 'c',
      title: 'C',
      filterFunction: columnStringFloatingFilterFunction,
      floatingFilterType: FloatingFilterType.STRING,
      componentForFilterCell: this.fw.floatingFilterComponent,
    },
    {
      propertyName: 'd',
      title: 'D',
      filterWithSelect: true,
      filterFunction: columnListFloatingFilterFunction,
      floatingFilterType: FloatingFilterType.LIST,
      componentForFilterCell: this.fw.floatingFilterComponent,
    },
  ];
}
