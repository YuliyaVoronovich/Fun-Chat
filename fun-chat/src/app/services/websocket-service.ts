import { baseURL, wsProtocol } from '../constants';
import type { WsMessage } from '../interfaces.ts/sockets';
import { SocketType } from '../interfaces.ts/sockets';

import { PubSub } from '../utils/pub-sub';

export function serializeMessage<T>(id: string, type: SocketType, payload: T): string {
  try {
    return JSON.stringify({ id, type, payload });
  } catch (err) {
    console.error('Error serializing message:', err);
    return '';
  }
}

const mls = 1000;

class SocketService {
  public socket: WebSocket;

  public userLoggedIn$ = new PubSub<'userLoggedIn'>();

  public usersActive$ = new PubSub<'usersActive'>();

  public usersInActive$ = new PubSub<'usersInActive'>();

  public userExternalLogin$ = new PubSub<'userExternalLogin'>();

  public userExternalLogout$ = new PubSub<'userExternalLogout'>();

  public messageReceived$ = new PubSub<'messageReceived'>();

  public messageHistory$ = new PubSub<'messageHistory'>();

  public messageDeliver$ = new PubSub<'messageDeliver'>();

  public messageDelete$ = new PubSub<'messageDelete'>();

  public messageRead$ = new PubSub<'messageRead'>();

  public messageEdit$ = new PubSub<'messageEdit'>();

  public error$ = new PubSub<'error'>();

  public connection$ = new PubSub<'connection'>();

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
      this.connection$.publish('connection', { connection: true });
      // userService.reLogin();
    };
    ws.onmessage = (event: MessageEvent<string>): void => {
      this.stateUpdater(event);
    };
    ws.onclose = () => {
      this.error$.publish('error', { error: 'Socket is closed. Reconnect will be attempted...' });
      setTimeout(() => {
        this.socket = this.joinBuildWSClient();
      }, mls);
    };

    ws.onerror = (event: Event) => {
      throw new Error(event.type);
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
        this.userLoggedIn$.publish('userLoggedIn', { isLogined, login });
      }
      if (type === SocketType.ERROR) {
        this.error$.publish('error', { error: response.payload.error });
      }
      if (type === SocketType.AllAuthenticatedUsers) {
        this.usersActive$.publish('usersActive', { users: response.payload.users });
      }
      if (type === SocketType.AllInAuthenticatedUsers) {
        this.usersInActive$.publish('usersInActive', { users: response.payload.users });
      }
      if (type === SocketType.UserExternalLogin) {
        const { isLogined, login } = response.payload.user;
        this.userExternalLogin$.publish('userExternalLogin', { isLogined, login });
      }
      if (type === SocketType.UserExternalLogout) {
        const { isLogined, login } = response.payload.user;
        this.userExternalLogout$.publish('userExternalLogout', { isLogined, login });
      }
      if (type === SocketType.MessageReceived) {
        const { id, text, to, from, datetime, status } = response.payload.message;
        this.messageReceived$.publish('messageReceived', { id, text, from, to, datetime, status });
      }
      if (type === SocketType.MessageHistory) {
        this.messageHistory$.publish('messageHistory', { messages: response.payload.messages });
      }
      if (type === SocketType.MessageDeliver) {
        this.messageDeliver$.publish('messageDeliver', {
          message: { id: response.payload.message.id, isDelivered: response.payload.message.status.isDelivered },
        });
      }
      if (type === SocketType.MessageDelete) {
        this.messageDelete$.publish('messageDelete', {
          message: { id: response.payload.message.id, isDeleted: response.payload.message.status.isDeleted },
        });
      }
      if (type === SocketType.MessageRead) {
        this.messageRead$.publish('messageRead', {
          message: { id: response.payload.message.id, isReaded: response.payload.message.status.isReaded },
        });
      }
      if (type === SocketType.MessageEdit) {
        this.messageEdit$.publish('messageEdit', {
          message: {
            id: response.payload.message.id,
            text: response.payload.message.text,
            isEdited: response.payload.message.status.isEdited,
          },
        });
      }
    } catch (error) {
      throw new Error(event.type);
    }
  }
}
export const socketService = new SocketService();
