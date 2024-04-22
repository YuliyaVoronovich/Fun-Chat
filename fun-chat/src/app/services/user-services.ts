import { sessionStorageInst } from './session-service';
import { socketService } from './websocket-service';

const idConnect = '222';

class UserService {
  public login(login: string, password: string) {
    socketService.login(idConnect, login, password).catch(() => {});
  }

  public logout(login: string, password: string) {
    socketService.logout(idConnect, login, password).catch(() => {});
  }

  public allActiveUsers() {
    socketService.allActiveUsers(idConnect).catch(() => {});
  }

  public allInActiveUsers() {
    socketService.allInActiveUsers(idConnect).catch(() => {});
  }

  public reLogin = () => {
    if (sessionStorageInst.checkUser('user')) {
      const login = sessionStorageInst.getUser('user')?.login;
      const password = sessionStorageInst.getUser('user')?.password;
      if (login && password) {
        socketService.socket.onopen = () => {
          this.login(login, password);
          this.allActiveUsers();
          this.allInActiveUsers();
        };
      }
    }
  };
}
export const userService = new UserService();
