/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { sessionStorageInst } from '../../services/session-service';
import { socketService } from '../../services/websocket-service';
import { BaseComponent } from '../../components/base-component';
import { userService } from '../../services/user-services';
import { SocketType } from '../../interfaces.ts/sockets';
import { LoginForm } from '../../components/login-form/login-form';
import { Modal } from '../../components/modal/modal';
import { Button } from '../../components/button/button';
import './login-page.scss';

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

    socketService.error$.subscribe(
      (data) => this.modal.alertMess(data.payload as string, 'danger'),
      (data) => data.type === SocketType.ERROR,
    );

    socketService.login$.subscribe(
      (data) => (data.payload.isLogined ? this.navigate() : null),
      (data) => data.type === SocketType.UserLogin,
    );

    socketService.logout$.subscribe((data) => data.type === SocketType.UserLogout);
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
