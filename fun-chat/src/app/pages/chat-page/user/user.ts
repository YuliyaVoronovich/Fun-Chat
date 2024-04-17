import { BaseComponent } from '../../../components/base-component';
import './user.scss';

export class User extends BaseComponent {
  private label: BaseComponent;

  constructor(login: string, isLogined: boolean) {
    super({ tag: 'li', className: 'user-item' });
    const online = isLogined ? '-active' : '-no-active';
    this.label = new BaseComponent({
      tag: 'div',
      className: `user-label status status${online}`,
      textContent: `${login}`,
    });
    this.appendChildren([this.label]);
  }
}
