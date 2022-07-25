import Service, { inject as service } from '@ember/service';
import { ensureSafeComponent } from '@embroider/util';
import PlainHtmlFloatingFilter from 'ember-models-table-floating-filter/components/models-table/themes/plain-html/floating-filter';
import EmberBootstrapV4FloatingFilter from 'ember-models-table-floating-filter/components/models-table/themes/ember-bootstrap-v4/floating-filter';
import EmberBootstrapV5FloatingFilter from 'ember-models-table-floating-filter/components/models-table/themes/ember-bootstrap-v5/floating-filter';

export default class FwService extends Service {
  constructor(owner, args) {
    super(owner, args);
    this.owner = owner;
  }

  @service('emt-themes/plain-html')
  plainHtmlTheme;

  @service('emt-themes/ember-bootstrap-v4')
  ebs4Theme;

  @service('emt-themes/ember-bootstrap-v5')
  ebs5Theme;

  @service('emt-themes/bootstrap3')
  defaultTheme;
  get uiFramework() {
    return this.owner.application.uiFramework;
  }

  get isBs4() {
    return window.location.href.includes('/bs4/') || this.uiFramework === 'bs4';
  }

  get isBs5() {
    return window.location.href.includes('/bs5/') || this.uiFramework === 'bs5';
  }

  get isPlainHtml() {
    return (
      window.location.href.includes('/plain-html/') ||
      this.uiFramework === 'plain-html'
    );
  }
  get isDefault() {
    return !this.uiFramework;
  }

  get themeInstance() {
    if (this.isBs4) {
      return this.ebs4Theme;
    }
    if (this.isBs5) {
      return this.ebs5Theme;
    }
    if (this.isPlainHtml) {
      return this.plainHtmlTheme;
    }
    return this.defaultTheme;
  }

  get floatingFilterComponent() {
    if (this.isBs4) {
      return ensureSafeComponent(EmberBootstrapV4FloatingFilter, this);
    }
    if (this.isBs5) {
      return ensureSafeComponent(EmberBootstrapV5FloatingFilter, this);
    }
    if (this.isPlainHtml) {
      return ensureSafeComponent(PlainHtmlFloatingFilter, this);
    }
    return '';
  }
}
