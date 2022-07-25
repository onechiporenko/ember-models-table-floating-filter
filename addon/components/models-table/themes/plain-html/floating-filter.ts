import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { cancel, debounce } from '@ember/runloop';
import ModelsTableFloatingFilterComponent from '../default/floating-filter';
import { EmberRunTimer } from '@ember/runloop/types';

export default class FloatingFilter extends ModelsTableFloatingFilterComponent {
  @tracked
  dropdownShown = false;

  @tracked
  declare timer: EmberRunTimer;

  protected hideDropdown(): void {
    this.dropdownShown = false;
  }

  @action
  protected onEnter(): void {
    this.dropdownShown = true;
    cancel(this.timer);
  }

  @action
  protected onLeave(): void {
    this.timer = debounce(this, this.hideDropdown, 500, false);
  }
}
