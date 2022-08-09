'use strict';

const {
  setupTestHooks,
  emberNew,
  emberGenerate,
} = require('ember-cli-blueprint-test-helpers/helpers');

const { expect } = require('ember-cli-blueprint-test-helpers/chai');

describe('Acceptance: ember generate ember-models-table-floating-filter (ember-cli-build.js)', function () {
  setupTestHooks(this);

  it('ember-models-table-floating-filter', function () {
    const args = ['ember-models-table-floating-filter'];

    return emberNew().then(() =>
      emberGenerate(args, (file) => {
        expect(file('ember-cli-build.js')).to.not.contain(
          'includePlainHtmlThemeCss'
        );
      })
    );
  });

  it('ember-models-table-floating-filter --iphtc', function () {
    const args = ['ember-models-table-floating-filter', '--iphtc'];

    return emberNew().then(() =>
      emberGenerate(args, (file) => {
        expect(file('ember-cli-build.js')).to.contain(
          'includePlainHtmlThemeCss: true'
        );
      })
    );
  });

  it('ember-models-table-floating-filter --include-plain-html-theme-css=true', function () {
    const args = [
      'ember-models-table-floating-filter',
      '--include-plain-html-theme-css=true',
    ];

    return emberNew().then(() =>
      emberGenerate(args, (file) => {
        expect(file('ember-cli-build.js')).to.contain(
          'includePlainHtmlThemeCss: true'
        );
      })
    );
  });
});
