import { sessionStorageInst } from '../../services/session-service';
import { BaseComponent } from '../base-component';
import { Logout } from '../logout/logout';
import './header.scss';

export class Header extends BaseComponent {
  private user: BaseComponent;

  private nameApp = new BaseComponent({ tag: 'span', className: 'app-title', textContent: 'Fun Chat' });

  private btnLogout = new Logout();

  constructor() {
    super({ tag: 'header', className: 'header card' });

    this.user = new BaseComponent({
      tag: 'span',
      className: 'user-title',
      textContent: `You: ${sessionStorageInst.getUser('user')?.login}`,
    });
    this.appendChildren([this.nameApp, this.user, this.btnLogout]);
  }
}
