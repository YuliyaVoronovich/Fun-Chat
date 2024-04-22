import { sessionStorageInst } from '../../services/session-service';
import { Button } from '../button/button';

export class Logout extends Button {
  constructor() {
    super({
      type: 'button',
      className: 'btn btn-sm btn-outline-danger',
      textContent: 'LOGOUT',
      onClick: (): void => {
        sessionStorageInst.deleteData('user');

        window.location.href = ``;
        window.history.pushState({}, '', '');
      },
    });
  }
}
