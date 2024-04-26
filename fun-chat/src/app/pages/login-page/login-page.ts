import { sessionStorageService } from '../../services/session-service';
import { BaseComponent } from '../../components/base-component';
import { UserService } from '../../services/user-services';
import { LoginForm } from '../../components/login-form/login-form';
import { Modal } from '../../components/modal/modal';
import { Button } from '../../components/button/button';
import './login-page.scss';
import { socketService } from '../../services/websocket-service';

export class LoginPage extends BaseComponent {
  private readonly userService = new UserService();

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

    socketService.error$.subscribe('error', (payload) => {
      this.modal.alertMess(payload.error, 'danger');
    });
    socketService.connection$.subscribe('connection', () => {
      this.modal.closeModal();
    });

    socketService.userLoggedIn$.subscribe('userLoggedIn', (payload) => {
      if (payload.isLogined) {
        window.location.href = `#chat`;
      }
    });
  }

  private getFormData = (login: string, password: string) => {
    if (login && password) {
      this.userService.login(login, password).catch((error: Error) => {
        throw new Error(error.message);
      });
      sessionStorageService.setItem('user', { login, password });
    }
  };

  // private navigate = () => {
  //   window.location.href = `#chat`;
  // };
}
