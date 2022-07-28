import ModelsTableBs3FF from 'ember-models-table-floating-filter/test-support/pages/models-table-bs';
import ModelsTableBs4FF from 'ember-models-table-floating-filter/test-support/pages/models-table-bs4';
import ModelsTableBs5FF from 'ember-models-table-floating-filter/test-support/pages/models-table-bs5';
import ModelsTablePlainHtmlFF from 'ember-models-table-floating-filter/test-support/pages/models-table-plain-html';

import ModelsTableBs3EMT from 'ember-models-table/test-support/pages/models-table-bs';
import ModelsTableBs4EMT from 'ember-models-table/test-support/pages/models-table-bs4';
import ModelsTableBs5EMT from 'ember-models-table/test-support/pages/models-table-bs5';
import ModelsTablePlainHtmlEMT from 'ember-models-table/test-support/pages/models-table-plain-html';

export const getPageObjectForModelsTable = (testContext) => {
  const uiFramework = testContext.owner.application.uiFramework;
  return (
    {
      bs4: ModelsTableBs4EMT,
      bs5: ModelsTableBs5EMT,
      'plain-html': ModelsTablePlainHtmlEMT,
    }[uiFramework] || ModelsTableBs3EMT
  );
};

export const getPageObjectForFloatingFilter = (testContext) => {
  const uiFramework = testContext.owner.application.uiFramework;
  return (
    {
      bs4: ModelsTableBs4FF,
      bs5: ModelsTableBs5FF,
      'plain-html': ModelsTablePlainHtmlFF,
    }[uiFramework] || ModelsTableBs3FF
  );
};
