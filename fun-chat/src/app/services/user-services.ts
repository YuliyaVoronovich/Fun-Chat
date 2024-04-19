import { sessionStorageInst } from './session-service';
import { socketService } from './websocket-service';

class UserService {
  public login(login: string, password: string) {
    socketService.login('222', login, password).catch(() => {});
  }

  public logout(login: string, password: string) {
    socketService.logout('222', login, password).catch(() => {});
  }

  public allActiveUsers() {
    socketService.allActiveUsers('222').catch(() => {});
  }

  public allInActiveUsers() {
    socketService.allInActiveUsers('222').catch(() => {});
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
