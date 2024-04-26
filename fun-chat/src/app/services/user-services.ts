import { SocketType } from '../interfaces.ts/sockets';
import { sessionStorageService } from './session-service';
import { serializeMessage, socketService } from './websocket-service';

export class UserService {
  private idConnect = '222';

  public login(login: string, password: string) {
    const userData = serializeMessage(this.idConnect, SocketType.UserLogin, {
      user: {
        login,
        password,
      },
    });

    return socketService.sendSocketMessage(userData);
  }

  public logout(login: string, password: string) {
    const userData = serializeMessage(this.idConnect, SocketType.UserLogout, {
      user: {
        login,
        password,
      },
    });
    return socketService.sendSocketMessage(userData);
  }

  public allActiveUsers() {
    const userData = serializeMessage(this.idConnect, SocketType.AllAuthenticatedUsers, null);
    return socketService.sendSocketMessage(userData);
  }

  public allInActiveUsers() {
    const userData = serializeMessage(this.idConnect, SocketType.AllInAuthenticatedUsers, null);
    return socketService.sendSocketMessage(userData);
  }

  public reLogin = () => {
    if (sessionStorageService.checkUser('user')) {
      const user = sessionStorageService.getUser('user');
      if (user) {
        if (user.login && user.password) {
          socketService.socket.onopen = () => {
            this.login(user.login, user.password).catch((error: Error) => {
              throw new Error(error.message);
            });
            this.allActiveUsers().catch((error: Error) => {
              throw new Error(error.message);
            });
            this.allInActiveUsers().catch((error: Error) => {
              throw new Error(error.message);
            });
          };
        }
      }
    }
  };
}
