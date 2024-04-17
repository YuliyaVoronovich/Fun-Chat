import { baseURL, wsProtocol } from '../constants';
import type { WsMessage } from '../interfaces.ts/sockets';
import { SocketType } from '../interfaces.ts/sockets';

import { pubSub } from '../utils/pub-sub';

function serializeMessage<T>(id: string, type: SocketType, payload: T): string {
  try {
    return JSON.stringify({ id, type, payload });
  } catch (err) {
    console.error('Error serializing message:', err);
    return '';
  }
}

class SocketService {
  public socket: WebSocket;

  public roomName?: string;

  constructor() {
    this.socket = this.joinBuildWSClient();
  }

  public sendSocketMessage(message: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        try {
          this.socket.send(message);
          resolve(true);
        } catch (err) {
          console.error(err);
          reject(new Error('Error sending message to server'));
        }
      } else {
        reject(new Error('Socket is not open'));
      }
    });
  }

  public joinBuildWSClient(): WebSocket {
    const ws = new WebSocket(`${wsProtocol}://${baseURL}`);

    ws.onmessage = (event: MessageEvent<string>): void => {
      this.stateUpdater(event);
    };
    ws.onerror = (event: Event): void => {
      console.error('ws connection error', event);
    };
    return ws;
  }

  private stateUpdater(event: MessageEvent<string>): void {
    try {
      const response: WsMessage = JSON.parse(event.data) as WsMessage;
      const { type } = response;
      if (type === SocketType.UserLogin) {
        const { isLogined, login } = response.payload.user;
        pubSub.publish('userLoggedIn', { isLogined, login });
      }
      if (type === SocketType.ERROR) {
        pubSub.publish('error', { error: response.payload.error });
      }
      if (type === SocketType.AllAuthenticatedUsers) {
        pubSub.publish('usersActive', { users: response.payload.users });
      }
      if (type === SocketType.AllInAuthenticatedUsers) {
        pubSub.publish('usersInActive', { users: response.payload.users });
      }
      if (type === SocketType.UserExternalLogin) {
        const { isLogined, login } = response.payload.user;
        pubSub.publish('userExternalLogin', { isLogined, login });
      }
      if (type === SocketType.UserExternalLogout) {
        const { isLogined, login } = response.payload.user;
        pubSub.publish('userExternalLogout', { isLogined, login });
      }
    } catch (error) {
      console.error(error);
    }
  }

  public login(id: string, login: string, password: string) {
    const userData = serializeMessage(id, SocketType.UserLogin, {
      user: {
        login,
        password,
      },
    });

    return this.sendSocketMessage(userData);
  }

  public logout(id: string, login: string, password: string) {
    const userData = serializeMessage(id, SocketType.UserLogout, {
      user: {
        login,
        password,
      },
    });
    return this.sendSocketMessage(userData);
  }

  public allActiveUsers(id: string) {
    const userData = serializeMessage(id, SocketType.AllAuthenticatedUsers, null);
    return this.sendSocketMessage(userData);
  }

  public allInActiveUsers(id: string) {
    const userData = serializeMessage(id, SocketType.AllInAuthenticatedUsers, null);
    return this.sendSocketMessage(userData);
  }

  // public allActiveUsers(id: string) {
  //   return new Promise((resolve) => {
  //     console.log(2);
  //     this.socket.onopen = () => {
  //       console.log(3);
  //       const userData = serializeMessage(id, SocketType.AllAuthenticatedUsers, null);
  //       console.log(userData);
  //       resolve(this.sendSocketMessage(userData));
  //     };
  //   });
  // }
}
export const socketService = new SocketService();
