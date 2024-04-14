import { socketService } from './websocket-service';

class UserService {
  public login(login: string, password: string) {
    socketService.login('222', login, password).catch(() => {});
  }

  public logout(login: string, password: string) {
    socketService.logout('222', login, password).catch(() => {});
  }
}
export const userService = new UserService();
