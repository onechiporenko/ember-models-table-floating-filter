'use strict';

const path = require('path');
const defaultOptions = {
  includePlainHtmlThemeCss: false,
  includeBs4ThemeCss: false,
  includeBs5ThemeCss: false,
};

module.exports = {
  name: require('./package').name,

  included: function () {
    const app = this._findHost.call(this);
    this._super.included.apply(this, arguments);
    const options = Object.assign(
      {},
      defaultOptions,
      app.options['ember-models-table-floating-filter'],
    );
    let vendorPath = path.join('vendor', 'ember-models-table-floating-filter');
    if (options.includePlainHtmlThemeCss) {
      app.import(path.join(vendorPath, 'plain-html.css'));
    }
    if (options.includeBs4ThemeCss) {
      app.import(path.join(vendorPath, 'bs4.css'));
    }
    if (options.includeBs5ThemeCss) {
      app.import(path.join(vendorPath, 'bs5.css'));
    }
  },
};
