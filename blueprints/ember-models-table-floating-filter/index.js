/* eslint-env node */

module.exports = {
  name: 'ember-models-table-floating-filter',
  description: 'Configure ember-models-table-floating-filter',

  normalizeEntityName: function () {
    // do nothing
  },

  afterInstall() {
    return this.addEmberModelsTable();
  },

  addEmberModelsTable() {
    if (!('ember-models-table' in this.project.dependencies())) {
      return this.addAddonToProject('ember-models-table');
    }
  },
};
