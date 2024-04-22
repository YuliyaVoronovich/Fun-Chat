/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { sessionStorageInst } from '../../services/session-service';
import { BaseComponent } from '../../components/base-component';
import { userService } from '../../services/user-services';
import { LoginForm } from '../../components/login-form/login-form';
import { Modal } from '../../components/modal/modal';
import { Button } from '../../components/button/button';
import './login-page.scss';
import { pubSub } from '../../utils/pub-sub';

export class LoginPage extends BaseComponent {
  private readonly form: LoginForm;

  private readonly modal = new Modal();

  private readonly about = new Button({
    type: 'button',
    className: 'btn btn-success',
    textContent: 'About',
    onClick: (): void => {
      window.location.href = `#about`;
    },
  });

  constructor() {
    super({ tag: 'div', className: 'wrapper login-wrapper' });
    this.form = new LoginForm(this.getFormData);
    this.appendChildren([this.form, this.about, this.modal]);

    pubSub.subscribe('error', (payload) => {
      this.modal.alertMess(payload.error, 'danger');
    });
    pubSub.subscribe('connection', () => {
      this.modal.closeModal();
    });

    pubSub.subscribe('userLoggedIn', (payload) => {
      if (payload.isLogined) {
        this.navigate();
      }
    });
  }

  private getFormData = (login: string, password: string) => {
    if (login && password) {
      userService.login(login, password);
      sessionStorageInst.setItem('user', { login, password });
    }
  };

  private navigate = () => {
    window.location.href = `#chat`;
  };
}
