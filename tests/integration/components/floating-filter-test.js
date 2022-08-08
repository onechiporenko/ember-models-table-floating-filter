import { module, test } from 'qunit';
import { setupRenderingTest } from 'dummy/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import {
  FloatingFilterType,
  columnNumberFloatingFilterFunction,
  columnStringFloatingFilterFunction,
  columnListFloatingFilterFunction,
} from 'ember-models-table-floating-filter/components/models-table/themes/default/floating-filter';
import { generateContent } from '../../helpers/f';
import {
  getPageObjectForFloatingFilter,
  getPageObjectForModelsTable,
} from '../../helpers/get-page-object';

let filters;

const columnFiltersOrder = [
  FloatingFilterType.NUMBER,
  FloatingFilterType.STRING,
  FloatingFilterType.LIST,
];

const numberFilterColumnValues = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
];

const stringFilterColumnValues = [
  'AB',
  'BC',
  'CD',
  'DE',
  'EF',
  'FG',
  'GH',
  'HI',
  'IJ',
  'JK',
];

const allListFilterOptions = [
  'AB',
  'BC',
  'CD',
  'DE',
  'EF',
  'FG',
  'GH',
  'HI',
  'IJ',
  'JK',
  'KL',
  'LM',
  'MN',
  'NO',
  'OP',
];

module('Integration | Component | floating-filter', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.floatingFilterPageObject = getPageObjectForFloatingFilter(this);
    this.modelsTablePageObject = getPageObjectForModelsTable(this);
    filters = this.floatingFilterPageObject.filters;
    const fw = this.owner.lookup('service:fw');
    this.themeInstance = fw.themeInstance;
    this.columns = [
      {
        propertyName: 'id',
        filterFunction: columnNumberFloatingFilterFunction,
        'emt-addons': {
          floatingFilter: {
            floatingFilterType: FloatingFilterType.NUMBER,
          },
        },
        componentForFilterCell: fw.floatingFilterComponent,
      },
      {
        propertyName: 'chars',
        filterFunction: columnStringFloatingFilterFunction,
        'emt-addons': {
          floatingFilter: {
            floatingFilterType: FloatingFilterType.STRING,
          },
        },
        componentForFilterCell: fw.floatingFilterComponent,
      },
      {
        propertyName: 'chars',
        filterFunction: columnListFloatingFilterFunction,
        filterWithSelect: true,
        'emt-addons': {
          floatingFilter: {
            floatingFilterType: FloatingFilterType.LIST,
          },
        },
        componentForFilterCell: fw.floatingFilterComponent,
      },
    ];
    this.data = generateContent(30, 0);
  });

  test('default render', async function (assert) {
    assert.expect(12);
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    columnFiltersOrder.forEach((filterType, index) => {
      const floatingFilter = filters.objectAt(index);
      assert.true(
        floatingFilter.filterInput,
        `readonly-input for ${filterType}-filter is shown`
      );
      assert.true(
        floatingFilter.clearFilterExists,
        `clear-filter button for ${filterType}-filter is shown`
      );
      assert.true(
        floatingFilter.clearFilterDisabled,
        `clear-filter button for ${filterType}-filter is disabled`
      );
      assert.true(
        floatingFilter.dropdownToggleExists,
        `dropdown-toggle button for ${filterType}-filter is shown`
      );
    });
  });

  test('dropdown content is shown on click dropdown-toggle', async function (assert) {
    assert.expect(6);
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    for (let index = 0; index < columnFiltersOrder.length; index++) {
      const floatingFilter = filters.objectAt(index);
      assert.false(
        floatingFilter.dropdownExists,
        `dropdown-content for ${columnFiltersOrder[index]} is hidden`
      );
      await floatingFilter.dropdownToggle();
      assert.true(
        floatingFilter.dropdownExists,
        `dropdown-content for ${columnFiltersOrder[index]} is shown`
      );
    }
  });

  test('filter-type select exists for needed floating-filters', async function (assert) {
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    await filters.objectAt(0).dropdownToggle();
    assert.true(
      filters.objectAt(0).filterTypeSelectExists,
      'filter-type select exists for NUMBER-filter'
    );
    await filters.objectAt(1).dropdownToggle();
    assert.true(
      filters.objectAt(1).filterTypeSelectExists,
      'filter-type select exists for STRING-filter'
    );
    await filters.objectAt(2).dropdownToggle();
    assert.false(
      filters.objectAt(2).filterTypeSelectExists,
      'filter-type select does not exist for LIST-filter'
    );
  });

  test('apply-filter button exists for all floating-filters', async function (assert) {
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    await filters.objectAt(0).dropdownToggle();
    assert.true(
      filters.objectAt(0).applyFilterExists,
      'apply-filter button exists for NUMBER-filter'
    );
    await filters.objectAt(1).dropdownToggle();
    assert.true(
      filters.objectAt(1).applyFilterExists,
      'apply-filter button exists for STRING-filter'
    );
    await filters.objectAt(2).dropdownToggle();
    assert.true(
      filters.objectAt(2).applyFilterExists,
      'apply-filter button exists for LIST-filter'
    );
  });

  test('list with filter options exists for LIST-filter', async function (assert) {
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    await filters.objectAt(2).dropdownToggle();
    assert.true(
      filters.objectAt(2).listFilterOptionsExists,
      'list with options exists'
    );
    assert.true(
      filters.objectAt(2).filterForListFilterOptionsExists,
      'filter for list exists'
    );
    assert.true(
      filters.objectAt(2).selectAllListFilterOptionsExists,
      'select-all btn exists'
    );
    assert.true(
      filters.objectAt(2).deselectAllListFilterOptionsExists,
      'deselect-all btn exists'
    );
  });

  test('NUMBER-filter (EQ)', async function (assert) {
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    const numberFilter = filters.objectAt(0);
    await numberFilter.dropdownToggle();
    await numberFilter.setFilterType('EQ');
    await numberFilter.setFirstArg(1);
    await numberFilter.applyFilter();

    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(0),
      ['1'],
      'valid rows are shown'
    );
    assert.strictEqual(numberFilter.filterInputValue, '= 1');
    await numberFilter.clearFilter();
    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(0),
      numberFilterColumnValues,
      'valid rows are shown'
    );
    assert.strictEqual(numberFilter.filterInputValue, '');
  });

  test('NUMBER-filter (NEQ)', async function (assert) {
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    const numberFilter = filters.objectAt(0);
    await numberFilter.dropdownToggle();
    await numberFilter.setFilterType('NEQ');
    await numberFilter.setFirstArg(1);
    await numberFilter.applyFilter();

    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(0),
      ['0', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      'valid rows are shown'
    );
    assert.strictEqual(numberFilter.filterInputValue, '!= 1');
    await numberFilter.clearFilter();
    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(0),
      numberFilterColumnValues,
      'valid rows are shown'
    );
    assert.strictEqual(numberFilter.filterInputValue, '');
  });

  test('NUMBER-filter (GT)', async function (assert) {
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    const numberFilter = filters.objectAt(0);
    await numberFilter.dropdownToggle();
    await numberFilter.setFilterType('GT');
    await numberFilter.setFirstArg(1);
    await numberFilter.applyFilter();

    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(0),
      ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
      'valid rows are shown'
    );
    assert.strictEqual(numberFilter.filterInputValue, '> 1');
    await numberFilter.clearFilter();
    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(0),
      numberFilterColumnValues,
      'valid rows are shown'
    );
    assert.strictEqual(numberFilter.filterInputValue, '');
  });

  test('NUMBER-filter (LT)', async function (assert) {
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    const numberFilter = filters.objectAt(0);
    await numberFilter.dropdownToggle();
    await numberFilter.setFilterType('LT');
    await numberFilter.setFirstArg(1);
    await numberFilter.applyFilter();

    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(0),
      ['0'],
      'valid rows are shown'
    );
    assert.strictEqual(numberFilter.filterInputValue, '< 1');
    await numberFilter.clearFilter();
    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(0),
      numberFilterColumnValues,
      'valid rows are shown'
    );
    assert.strictEqual(numberFilter.filterInputValue, '');
  });

  test('NUMBER-filter (GTE)', async function (assert) {
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    const numberFilter = filters.objectAt(0);
    await numberFilter.dropdownToggle();
    await numberFilter.setFilterType('GTE');
    await numberFilter.setFirstArg(1);
    await numberFilter.applyFilter();

    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(0),
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      'valid rows are shown'
    );
    assert.strictEqual(numberFilter.filterInputValue, '>= 1');
    await numberFilter.clearFilter();
    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(0),
      numberFilterColumnValues,
      'valid rows are shown'
    );
    assert.strictEqual(numberFilter.filterInputValue, '');
  });

  test('NUMBER-filter (LTE)', async function (assert) {
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    const numberFilter = filters.objectAt(0);
    await numberFilter.dropdownToggle();
    await numberFilter.setFilterType('LTE');
    await numberFilter.setFirstArg(1);
    await numberFilter.applyFilter();

    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(0),
      ['0', '1'],
      'valid rows are shown'
    );
    assert.strictEqual(numberFilter.filterInputValue, '<= 1');
    await numberFilter.clearFilter();
    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(0),
      numberFilterColumnValues,
      'valid rows are shown'
    );
    assert.strictEqual(numberFilter.filterInputValue, '');
  });

  test('NUMBER-filter (RANGE)', async function (assert) {
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    const numberFilter = filters.objectAt(0);
    await numberFilter.dropdownToggle();
    await numberFilter.setFilterType('RANGE');
    await numberFilter.setFirstArg(1);
    await numberFilter.setSecondArg(3);
    await numberFilter.applyFilter();

    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(0),
      ['1', '2', '3'],
      'valid rows are shown'
    );
    assert.strictEqual(numberFilter.filterInputValue, '1 - 3');
    await numberFilter.clearFilter();
    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(0),
      numberFilterColumnValues,
      'valid rows are shown'
    );
    assert.strictEqual(numberFilter.filterInputValue, '');
  });

  test('STRING-filter (EQ)', async function (assert) {
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    const stringFilter = filters.objectAt(1);
    await stringFilter.dropdownToggle();
    await stringFilter.setFilterType('EQ');
    await stringFilter.setFirstArg('AB');
    await stringFilter.applyFilter();

    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(1),
      ['AB', 'AB'],
      'valid rows are shown'
    );
    assert.strictEqual(stringFilter.filterInputValue, '= AB');
    await stringFilter.clearFilter();
    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(1),
      stringFilterColumnValues,
      'valid rows are shown'
    );
    assert.strictEqual(stringFilter.filterInputValue, '');
  });

  test('STRING-filter (NEQ)', async function (assert) {
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    const stringFilter = filters.objectAt(1);
    await stringFilter.dropdownToggle();
    await stringFilter.setFilterType('NEQ');
    await stringFilter.setFirstArg('AB');
    await stringFilter.applyFilter();

    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(1),
      ['BC', 'CD', 'DE', 'EF', 'FG', 'GH', 'HI', 'IJ', 'JK', 'KL'],
      'valid rows are shown'
    );
    assert.strictEqual(stringFilter.filterInputValue, '!= AB');
    await stringFilter.clearFilter();
    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(1),
      stringFilterColumnValues,
      'valid rows are shown'
    );
    assert.strictEqual(stringFilter.filterInputValue, '');
  });

  test('STRING-filter (Starts With)', async function (assert) {
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    const stringFilter = filters.objectAt(1);
    await stringFilter.dropdownToggle();
    await stringFilter.setFilterType('STARTS_WITH');
    await stringFilter.setFirstArg('A');
    await stringFilter.applyFilter();

    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(1),
      ['AB', 'AB'],
      'valid rows are shown'
    );
    assert.strictEqual(stringFilter.filterInputValue, '^ A');
    await stringFilter.clearFilter();
    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(1),
      stringFilterColumnValues,
      'valid rows are shown'
    );
    assert.strictEqual(stringFilter.filterInputValue, '');
  });

  test('STRING-filter (Not Starts With)', async function (assert) {
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    const stringFilter = filters.objectAt(1);
    await stringFilter.dropdownToggle();
    await stringFilter.setFilterType('NOT_STARTS_WITH');
    await stringFilter.setFirstArg('A');
    await stringFilter.applyFilter();

    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(1),
      ['BC', 'CD', 'DE', 'EF', 'FG', 'GH', 'HI', 'IJ', 'JK', 'KL'],
      'valid rows are shown'
    );
    assert.strictEqual(stringFilter.filterInputValue, '!^ A');
    await stringFilter.clearFilter();
    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(1),
      stringFilterColumnValues,
      'valid rows are shown'
    );
    assert.strictEqual(stringFilter.filterInputValue, '');
  });

  test('STRING-filter (Ends With)', async function (assert) {
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    const stringFilter = filters.objectAt(1);
    await stringFilter.dropdownToggle();
    await stringFilter.setFilterType('ENDS_WITH');
    await stringFilter.setFirstArg('B');
    await stringFilter.applyFilter();

    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(1),
      ['AB', 'AB'],
      'valid rows are shown'
    );
    assert.strictEqual(stringFilter.filterInputValue, 'B $');
    await stringFilter.clearFilter();
    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(1),
      stringFilterColumnValues,
      'valid rows are shown'
    );
    assert.strictEqual(stringFilter.filterInputValue, '');
  });

  test('STRING-filter (Not Ends With)', async function (assert) {
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    const stringFilter = filters.objectAt(1);
    await stringFilter.dropdownToggle();
    await stringFilter.setFilterType('NOT_ENDS_WITH');
    await stringFilter.setFirstArg('B');
    await stringFilter.applyFilter();

    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(1),
      ['BC', 'CD', 'DE', 'EF', 'FG', 'GH', 'HI', 'IJ', 'JK', 'KL'],
      'valid rows are shown'
    );
    assert.strictEqual(stringFilter.filterInputValue, 'B !$');
    await stringFilter.clearFilter();
    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(1),
      stringFilterColumnValues,
      'valid rows are shown'
    );
    assert.strictEqual(stringFilter.filterInputValue, '');
  });

  test('STRING-filter (Contains)', async function (assert) {
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    const stringFilter = filters.objectAt(1);
    await stringFilter.dropdownToggle();
    await stringFilter.setFilterType('CONTAINS');
    await stringFilter.setFirstArg('B');
    await stringFilter.applyFilter();

    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(1),
      ['AB', 'BC', 'AB', 'BC'],
      'valid rows are shown'
    );
    assert.strictEqual(stringFilter.filterInputValue, '+ B');
    await stringFilter.clearFilter();
    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(1),
      stringFilterColumnValues,
      'valid rows are shown'
    );
    assert.strictEqual(stringFilter.filterInputValue, '');
  });

  test('STRING-filter (Not Contains)', async function (assert) {
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    const stringFilter = filters.objectAt(1);
    await stringFilter.dropdownToggle();
    await stringFilter.setFilterType('NOT_CONTAINS');
    await stringFilter.setFirstArg('B');
    await stringFilter.applyFilter();

    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(1),
      ['CD', 'DE', 'EF', 'FG', 'GH', 'HI', 'IJ', 'JK', 'KL', 'LM'],
      'valid rows are shown'
    );
    assert.strictEqual(stringFilter.filterInputValue, '- B');
    await stringFilter.clearFilter();
    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(1),
      stringFilterColumnValues,
      'valid rows are shown'
    );
    assert.strictEqual(stringFilter.filterInputValue, '');
  });

  test('STRING-filter (Blank)', async function (assert) {
    this.data[0].chars = '';
    this.data[1].chars = '';
    this.data[2].chars = '';
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);

    const stringFilter = filters.objectAt(1);
    await stringFilter.dropdownToggle();
    await stringFilter.setFilterType('BLANK');
    await stringFilter.applyFilter();

    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(1),
      ['', '', ''],
      'valid rows are shown'
    );
    assert.strictEqual(stringFilter.filterInputValue, '""');
    await stringFilter.clearFilter();
    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(1),
      ['', '', '', 'DE', 'EF', 'FG', 'GH', 'HI', 'IJ', 'JK'],
      'valid rows are shown'
    );
    assert.strictEqual(stringFilter.filterInputValue, '');
  });

  test('STRING-filter (Not Blank)', async function (assert) {
    this.data[0].chars = '';
    this.data[1].chars = '';
    this.data[2].chars = '';
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);

    const stringFilter = filters.objectAt(1);
    await stringFilter.dropdownToggle();
    await stringFilter.setFilterType('NOT_BLANK');
    await stringFilter.applyFilter();

    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(1),
      ['DE', 'EF', 'FG', 'GH', 'HI', 'IJ', 'JK', 'KL', 'LM', 'MN'],
      'valid rows are shown'
    );
    assert.strictEqual(stringFilter.filterInputValue, '!""');
    await stringFilter.clearFilter();
    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(1),
      ['', '', '', 'DE', 'EF', 'FG', 'GH', 'HI', 'IJ', 'JK'],
      'valid rows are shown'
    );
    assert.strictEqual(stringFilter.filterInputValue, '');
  });

  test('LIST-filter (select all)', async function (assert) {
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    const listFilter = filters.objectAt(2);
    await listFilter.dropdownToggle();
    await listFilter.selectAllListFilterOptions();
    await listFilter.applyFilter();

    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(2),
      stringFilterColumnValues,
      'valid rows are shown'
    );
    assert.strictEqual(
      listFilter.filterInputValue,
      'Any of (15) AB, BC, CD, DE, EF, FG, GH, HI, IJ, JK, KL, LM, MN, NO, OP'
    );
    await listFilter.clearFilter();
    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(2),
      stringFilterColumnValues,
      'valid rows are shown'
    );
    assert.strictEqual(listFilter.filterInputValue, '');
  });

  test('LIST-filter (deselect all)', async function (assert) {
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    const listFilter = filters.objectAt(2);
    await listFilter.dropdownToggle();
    await listFilter.deselectAllListFilterOptions();
    await listFilter.applyFilter();

    assert.strictEqual(this.modelsTablePageObject.rows.length, 1);
    assert.ok(
      /Show 0 - 0 of 0( clear)? Clear all filters/.test(
        this.modelsTablePageObject.summary
      )
    );
    assert.strictEqual(listFilter.filterInputValue, 'Any of (0) ');
    await listFilter.clearFilter();
    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(2),
      stringFilterColumnValues,
      'valid rows are shown'
    );
    assert.strictEqual(listFilter.filterInputValue, '');
  });

  test('LIST-filter (select custom)', async function (assert) {
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    const listFilter = filters.objectAt(2);
    await listFilter.dropdownToggle();
    await listFilter.deselectAllListFilterOptions();
    await listFilter.listFilterOptions.objectAt(0).click();
    await listFilter.listFilterOptions.objectAt(1).click();

    await listFilter.applyFilter();
    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(1),
      ['AB', 'BC', 'AB', 'BC'],
      'valid rows are shown'
    );
    assert.strictEqual(listFilter.filterInputValue, 'Any of (2) AB, BC');
    await listFilter.clearFilter();
    assert.deepEqual(
      this.modelsTablePageObject.getColumnCells(2),
      stringFilterColumnValues,
      'valid rows are shown'
    );
    assert.strictEqual(listFilter.filterInputValue, '');
  });

  test('LIST-filter (filter list options)', async function (assert) {
    await render(hbs`<ModelsTable
      @themeInstance={{this.themeInstance}}
      @columns={{this.columns}}
      @data={{this.data}}
    />`);
    const listFilter = filters.objectAt(2);
    await listFilter.dropdownToggle();
    assert.deepEqual(
      listFilter.listFilterOptions.map((opt) => opt.content),
      allListFilterOptions,
      'valid rows are shown'
    );

    await listFilter.filterForListFilterOptions('B');

    assert.deepEqual(
      listFilter.listFilterOptions.map((opt) => opt.content),
      ['AB', 'BC'],
      'valid rows are shown'
    );

    await listFilter.filterForListFilterOptions('');

    assert.deepEqual(
      listFilter.listFilterOptions.map((opt) => opt.content),
      allListFilterOptions,
      'valid rows are shown'
    );
  });
});
