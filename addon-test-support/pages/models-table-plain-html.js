import { create } from 'ember-cli-page-object';

import { definition as definitionBs } from './models-table-bs';

export const definition = Object.assign({}, definitionBs, {});

export default create(definition);
