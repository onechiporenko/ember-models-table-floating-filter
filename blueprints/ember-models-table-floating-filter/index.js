/* eslint-env node */

const fs = require('fs-extra');
const chalk = require('chalk');
const BuildConfigEditor = require('ember-cli-build-config-editor');

const {
  prototype: { hasOwnProperty },
} = Object;

module.exports = {
  name: 'ember-models-table-floating-filter',
  description: 'Configure ember-models-table-floating-filter',

  availableOptions: [
    {
      name: 'include-plain-html-theme-css',
      type: Boolean,
      default: false,
      aliases: ['iphtc'],
    },
    {
      name: 'include-bs4-theme-css',
      type: Boolean,
      default: false,
      aliases: ['ibs4tc'],
    },
    {
      name: 'include-bs5-theme-css',
      type: Boolean,
      default: false,
      aliases: ['ibs5tc'],
    },
  ],

  normalizeEntityName: function () {
    // do nothing
  },

  beforeInstall(options) {
    this.includePlainHtmlThemeCss = hasOwnProperty.call(
      options,
      'includePlainHtmlThemeCss',
    )
      ? options.includePlainHtmlThemeCss
      : false;
    this.includeBs4ThemeCss = hasOwnProperty.call(options, 'includeBs4ThemeCss')
      ? options.includeBs4ThemeCss
      : true;
    this.includeBs5ThemeCss = hasOwnProperty.call(options, 'includeBs5ThemeCss')
      ? options.includeBs5ThemeCss
      : true;
  },

  afterInstall() {
    this.addBuildConfiguration();
    return this.addEmberModelsTable();
  },

  addBuildConfiguration() {
    const file = 'ember-cli-build.js';
    const settings = {};

    if (this.includePlainHtmlThemeCss) {
      settings.includePlainHtmlThemeCss = this.includePlainHtmlThemeCss;
    }
    if (this.includeBs4ThemeCss) {
      settings.includeBs4ThemeCss = this.includeBs4ThemeCss;
    }
    if (this.includeBs5ThemeCss) {
      settings.includeBs5ThemeCss = this.includeBs5ThemeCss;
    }

    if (!fs.existsSync(file)) {
      this.ui.writeLine(chalk.red(`Could not find ${file} to modify.`));
      return;
    }

    const source = fs.readFileSync(file, 'utf-8');
    const build = new BuildConfigEditor(source);

    try {
      const newBuild = build.edit(this.name, settings);
      fs.writeFileSync(file, newBuild.code());
      this.ui.writeLine(
        chalk.green(
          `Added ember-models-table-floating-filter configuration to ${file}.`,
        ),
      );
    } catch (error) {
      const settingsString = JSON.stringify(settings);
      this.ui.writeLine(
        chalk.red(
          `Configuration file could not be edited. Manually update your ${file} to include '${this.name}': ${settingsString}.`,
        ),
      );
    }
  },

  addEmberModelsTable() {
    if (!('ember-models-table' in this.project.dependencies())) {
      return this.addAddonToProject('ember-models-table', {
        iphtc: this.includePlainHtmlThemeCss,
      });
    }
  },
};
