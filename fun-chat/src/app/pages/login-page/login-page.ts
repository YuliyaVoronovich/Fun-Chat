/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { sessionStorageInst } from '../../services/session-service';
import { socketService } from '../../services/websocket-service';
import { BaseComponent } from '../../components/base-component';
import { userService } from '../../services/user-services';
import { SocketType } from '../../interfaces.ts/sockets';
import { LoginForm } from '../../components/login-form/login-form';
import { Modal } from '../../components/modal/modal';

export class LoginPage extends BaseComponent {
  private readonly form: LoginForm;

  private readonly modal = new Modal();

  constructor() {
    super({ tag: 'div', className: 'login-wrapper' });
    this.form = new LoginForm(this.getFormData);
    this.appendChildren([this.form, this.modal]);

    // подписка на событие

    socketService.error$.subscribe(
      (data) => this.modal.alertMess(data.payload as string, 'danger'),
      (data) => data.type === SocketType.ERROR,
    );

    socketService.login$.subscribe(
      (data) => console.log('ObserverA:', data),
      (data) => data.type === SocketType.UserLogin,
    );

    socketService.logout$.subscribe((data) => data.type === SocketType.UserLogout);

    // userService.logout('Qwerty', 'Qwerty');
  }

  private getFormData = (login: string, password: string) => {
    console.log(login);
    console.log(password);

    if (login && password) {
      userService.login(login, password);
      sessionStorageInst.setItem('user', { login, password });
    }
  };
}
