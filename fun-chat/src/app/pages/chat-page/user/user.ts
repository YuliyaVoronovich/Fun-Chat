import type { IsUserLogin } from 'src/app/interfaces.ts/sockets';
import { BaseComponent } from '../../../components/base-component';
import './user.scss';

export class User extends BaseComponent {
  private label: BaseComponent;

  private currentUser: IsUserLogin;

  constructor(login: string, isLogined: boolean, onClick: (el: IsUserLogin) => void) {
    super({ tag: 'li', className: 'user-item' });
    this.currentUser = {
      login,
      isLogined,
    };
    const online = isLogined ? '-active' : '-no-active';
    this.label = new BaseComponent({
      tag: 'div',
      className: `user-label status status${online}`,
      textContent: `${login}`,
    });
    if (onClick) {
      this.addListener('click', () => {
        onClick(this.currentUser);
      });
    }
    this.appendChildren([this.label]);
  }
}
