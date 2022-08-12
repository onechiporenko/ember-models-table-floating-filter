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
        expect(file('ember-cli-build.js')).to.not.contain('includeBs4ThemeCss');
        expect(file('ember-cli-build.js')).to.not.contain('includeBs5ThemeCss');
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
        expect(file('ember-cli-build.js')).to.not.contain('includeBs4ThemeCss');
        expect(file('ember-cli-build.js')).to.not.contain('includeBs5ThemeCss');
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
        expect(file('ember-cli-build.js')).to.not.contain('includeBs4ThemeCss');
        expect(file('ember-cli-build.js')).to.not.contain('includeBs5ThemeCss');
      })
    );
  });

  it('ember-models-table-floating-filter --ibs4tc', function () {
    const args = ['ember-models-table-floating-filter', '--ibs4tc'];

    return emberNew().then(() =>
      emberGenerate(args, (file) => {
        expect(file('ember-cli-build.js')).to.not.contain(
          'includePlainHtmlThemeCss'
        );
        expect(file('ember-cli-build.js')).to.contain(
          'includeBs4ThemeCss: true'
        );
        expect(file('ember-cli-build.js')).to.not.contain('includeBs5ThemeCss');
      })
    );
  });

  it('ember-models-table-floating-filter --include-bs4-theme-css=true', function () {
    const args = [
      'ember-models-table-floating-filter',
      '--include-bs4-theme-css=true',
    ];

    return emberNew().then(() =>
      emberGenerate(args, (file) => {
        expect(file('ember-cli-build.js')).to.not.contain(
          'includePlainHtmlThemeCss'
        );
        expect(file('ember-cli-build.js')).to.contain(
          'includeBs4ThemeCss: true'
        );
        expect(file('ember-cli-build.js')).to.not.contain('includeBs5ThemeCss');
      })
    );
  });

  it('ember-models-table-floating-filter --ibs5tc', function () {
    const args = ['ember-models-table-floating-filter', '--ibs4tc'];

    return emberNew().then(() =>
      emberGenerate(args, (file) => {
        expect(file('ember-cli-build.js')).to.not.contain(
          'includePlainHtmlThemeCss'
        );
        expect(file('ember-cli-build.js')).to.contain(
          'includeBs5ThemeCss: true'
        );
        expect(file('ember-cli-build.js')).to.not.contain('includeBs4ThemeCss');
      })
    );
  });

  it('ember-models-table-floating-filter --include-bs5-theme-css=true', function () {
    const args = [
      'ember-models-table-floating-filter',
      '--include-bs5-theme-css=true',
    ];

    return emberNew().then(() =>
      emberGenerate(args, (file) => {
        expect(file('ember-cli-build.js')).to.not.contain(
          'includePlainHtmlThemeCss'
        );
        expect(file('ember-cli-build.js')).to.contain(
          'includeBs5ThemeCss: true'
        );
        expect(file('ember-cli-build.js')).to.not.contain('includeBs4ThemeCss');
      })
    );
  });
});
