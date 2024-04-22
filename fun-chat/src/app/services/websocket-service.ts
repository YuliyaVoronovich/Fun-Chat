import { baseURL, wsProtocol } from '../constants';
import type { WsMessage } from '../interfaces.ts/sockets';
import { SocketType } from '../interfaces.ts/sockets';

import { pubSub } from '../utils/pub-sub';
import { sessionStorageInst } from './session-service';

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

  public joinBuildWSClient() {
    const ws = new WebSocket(`${wsProtocol}://${baseURL}`);

    ws.onopen = (): void => {
      pubSub.publish('connection', { connection: true });
      if (sessionStorageInst.checkUser('user')) {
        const login = sessionStorageInst.getUser('user')?.login;
        const password = sessionStorageInst.getUser('user')?.password;
        if (login && password) {
          this.login('id', login, password).catch(() => {});
        }
      }
    };
    ws.onmessage = (event: MessageEvent<string>): void => {
      this.stateUpdater(event);
    };
    ws.onclose = () => {
      pubSub.publish('error', { error: 'Socket is closed. Reconnect will be attempted...' });
      setTimeout(() => {
        this.socket = this.joinBuildWSClient();
      }, 1000);
    };

    ws.onerror = (event: Event) => {
      console.error('ws connection error', event);
      ws.close();
    };
    return ws;
  }
  // eslint-disable-next-line
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
      if (type === SocketType.MessageReceived) {
        const { id, text, to, from, datetime, status } = response.payload.message;
        pubSub.publish('messageReceived', { id, text, from, to, datetime, status });
      }
      if (type === SocketType.MessageHistory) {
        pubSub.publish('messageHistory', { messages: response.payload.messages });
      }
      if (type === SocketType.MessageDeliver) {
        pubSub.publish('messageDeliver', {
          message: { id: response.payload.message.id, isDelivered: response.payload.message.status.isDelivered },
        });
      }
      if (type === SocketType.MessageDelete) {
        pubSub.publish('messageDelete', {
          message: { id: response.payload.message.id, isDeleted: response.payload.message.status.isDeleted },
        });
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

  public sendMsg(id: string, text: string, to: string) {
    const userData = serializeMessage(id, SocketType.MessageReceived, {
      message: {
        text,
        to,
      },
    });

    return this.sendSocketMessage(userData);
  }

  public getHistoryMsg(id: string, login: string) {
    const userData = serializeMessage(id, SocketType.MessageHistory, {
      user: {
        login,
      },
    });
    return this.sendSocketMessage(userData);
  }

  public deleteMsg(id: string, idMsg: string) {
    const userData = serializeMessage(id, SocketType.MessageDelete, {
      message: {
        id: idMsg,
      },
    });
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
