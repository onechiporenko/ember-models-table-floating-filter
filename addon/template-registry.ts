import DefaultFloatingFilter from './components/models-table/themes/default/floating-filter';
import EmberBootstrapV4FloatingFilter from './components/models-table/themes/ember-bootstrap-v4/floating-filter';
import EmberBootstrapV5FloatingFilter from './components/models-table/themes/ember-bootstrap-v5/floating-filter';
import PlainHtmlFloatingFilter from './components/models-table/themes/plain-html/floating-filter';

export default interface Registry {
  'ModelsTable::Themes::Default::FloatingFilter': typeof DefaultFloatingFilter;
  'models-table/themes/default/floating-filter': typeof DefaultFloatingFilter;

  'ModelsTable::Themes::EmberBootstrapV4::FloatingFilter': typeof EmberBootstrapV4FloatingFilter;
  'models-table/themes/ember-bootstrap-v4/floating-filter': typeof EmberBootstrapV4FloatingFilter;

  'ModelsTable::Themes::EmberBootstrapV5::FloatingFilter': typeof EmberBootstrapV5FloatingFilter;
  'models-table/themes/ember-bootstrap-v5/floating-filter': typeof EmberBootstrapV5FloatingFilter;

  'ModelsTable::Themes::PlainHtml::FloatingFilter': typeof PlainHtmlFloatingFilter;
  'models-table/themes/plain-html/floating-filter': typeof PlainHtmlFloatingFilter;
}
