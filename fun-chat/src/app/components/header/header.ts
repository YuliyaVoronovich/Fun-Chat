import { sessionStorageService } from '../../services/session-service';
import { BaseComponent } from '../base-component';
import { Button } from '../button/button';
import { Logout } from '../logout/logout';
import './header.scss';

export class Header extends BaseComponent {
  private user: BaseComponent;

  private nameApp = new BaseComponent({ tag: 'span', className: 'app-title', textContent: 'Fun Chat' });

  private btnLogout = new Logout();

  private login = sessionStorageService.getUser('user')?.login;

  private readonly about = new Button({
    type: 'button',
    className: 'btn btn-success about-btn',
    textContent: 'About',
    onClick: (): void => {
      window.location.href = `#about`;
    },
  });

  constructor() {
    super({ tag: 'header', className: 'header card' });

    this.user = new BaseComponent({
      tag: 'span',
      className: 'user-title',
    });
    if (this.login) {
      this.setTextContent(`You: ${this.login}`);
    }

    this.appendChildren([this.nameApp, this.user, this.about, this.btnLogout]);
  }
}
