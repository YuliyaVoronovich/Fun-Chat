import type { WsMessage } from '../interfaces.ts/sockets';
import { SocketType } from '../interfaces.ts/sockets';

import { ObserverWithFilter } from '../utils/observable';

const baseURL = 'localhost:4000';
const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

function serializeMessage<T>(id: string, type: SocketType, payload: T): string {
  try {
    return JSON.stringify({ id, type, payload });
  } catch (err) {
    console.error('Error serializing message:', err);
    return '';
  }
}

interface EventData {
  type: string;
  payload: unknown;
}

class SocketService {
  public socket: WebSocket;

  public roomName?: string;

  public login$ = new ObserverWithFilter<EventData>();

  public logout$ = new ObserverWithFilter<EventData>();

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

      // подписка
      switch (type) {
        case SocketType.UserLogin: {
          this.login$.notify({ type: SocketType.UserLogin, payload: { user: response.payload.user } });
          break;
        }
        case SocketType.UserLogout:
          this.logout$.notify({ type: SocketType.UserLogout, payload: { user: response.payload.user } });
          break;
        default:
          break;
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
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
}
export const socketService = new SocketService();
