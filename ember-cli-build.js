'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  const options = {
    outputPaths: {
      app: {
        css: {
          app: '/assets/app.css',
        },
      },
    },
  };
  if (process.env.EMT_UI === 'plain-html') {
    options.outputPaths.app.css['plain-html'] = '/assets/plain-html.css';
    options['ember-models-table'] = {
      includePlainHtmlThemeCss: true,
    };
  }
  switch (process.env.EMT_UI) {
    case 'bs4': {
      options.outputPaths.app.css['bs'] = '/assets/bs.css';
      options['ember-bootstrap'] = {
        bootstrapVersion: 4,
        importBootstrapCSS: true,
      };
      break;
    }
    case 'bs5': {
      options.outputPaths.app.css['bs'] = '/assets/bs.css';
      options['ember-bootstrap'] = {
        bootstrapVersion: 5,
        importBootstrapCSS: true,
      };
      break;
    }
  }
  let app = new EmberAddon(defaults, options);

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
