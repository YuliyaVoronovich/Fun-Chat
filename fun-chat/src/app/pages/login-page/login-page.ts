/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
import { socketService } from '../../services/websocket-service';
import { BaseComponent } from '../../components/base-component';
import { userService } from '../../services/user-services';
import { SocketType } from '../../interfaces.ts/sockets';
import { LoginForm } from '../../components/login-form/login-form';

export class LoginPage extends BaseComponent {
  private readonly form: LoginForm;

  constructor() {
    super({ tag: 'div', className: 'login-wrapper' });
    this.form = new LoginForm(this.getFormData);
    this.appendChildren([this.form]);

    // подписка на событие
    socketService.login$.subscribe(
      (data) => console.log('ObserverA:', data),
      (data) => data.type === SocketType.UserLogin,
    );

    socketService.logout$.subscribe(
      (data) => console.log('ObserverB:', data),
      (data) => data.type === SocketType.UserLogout,
    );

    // userService.logout('Qwerty', 'Qwerty');
  }

  private getFormData = (name: string, password: string) => {
    userService.login(name, password);
  };
}
