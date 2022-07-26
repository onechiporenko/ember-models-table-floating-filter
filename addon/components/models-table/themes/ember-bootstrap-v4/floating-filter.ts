import { ensureSafeComponent } from '@embroider/util';
import ModelsTableFloatingFilterComponent from '../default/floating-filter';
import {
  getBsDropdown,
  getBsButton,
  getBsForm,
} from '../../../../utils/emt/themes/ebs';

export default class FloatingFilter extends ModelsTableFloatingFilterComponent {
  get BsDropdown(): unknown {
    return ensureSafeComponent(getBsDropdown(), this);
  }
  get BsButton(): unknown {
    return ensureSafeComponent(getBsButton(), this);
  }
  get BsForm(): unknown {
    return ensureSafeComponent(getBsForm(), this);
  }
}
