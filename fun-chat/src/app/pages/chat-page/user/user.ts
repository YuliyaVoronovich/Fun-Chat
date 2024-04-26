import type { IUserLoginned } from 'src/app/interfaces.ts/sockets';
import { BaseComponent } from '../../../components/base-component';
import './user.scss';

export class User extends BaseComponent {
  private label: BaseComponent;

  private countMsg: BaseComponent;

  private currentUser: IUserLoginned;

  constructor(login: string, isLogined: boolean, countMessageUnRead: number, onClick?: (user: IUserLoginned) => void) {
    super({ tag: 'li', className: 'user-item' });
    this.currentUser = {
      login,
      isLogined,
    };
    const countUnReadMsg = countMessageUnRead || '';
    const online = isLogined ? '-active' : '-no-active';
    this.countMsg = new BaseComponent({
      tag: 'span',
      className: `badge text-bg-danger`,
      textContent: `${countUnReadMsg}`,
    });
    this.label = new BaseComponent({
      tag: 'div',
      className: `user-label status status${online}`,
      textContent: login,
    });
    this.label.appendChildren([this.countMsg]);
    if (onClick) {
      this.addListener('click', () => {
        onClick(this.currentUser);
      });
    }
    this.appendChildren([this.label]);
  }

  public get user() {
    return this.currentUser;
  }

  public set countUnReadMsg(value: string) {
    this.countMsg.setTextContent(value);
  }
}
