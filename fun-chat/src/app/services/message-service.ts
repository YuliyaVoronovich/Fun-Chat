import { SocketType } from '../interfaces.ts/sockets';
import { serializeMessage, socketService } from './websocket-service';

export class MessageService {
  private idConnect = '222';

  public sendMsg(text: string, to: string) {
    const userData = serializeMessage(this.idConnect, SocketType.MessageReceived, {
      message: {
        text,
        to,
      },
    });

    return socketService.sendSocketMessage(userData);
  }

  public editMsg(idMsg: string, text: string) {
    const userData = serializeMessage(this.idConnect, SocketType.MessageEdit, {
      message: {
        id: idMsg,
        text,
      },
    });

    return socketService.sendSocketMessage(userData);
  }

  public getHistoryMsg(login: string) {
    const userData = serializeMessage(this.idConnect, SocketType.MessageHistory, {
      user: {
        login,
      },
    });
    return socketService.sendSocketMessage(userData);
  }

  public deleteMsg(id: string) {
    const userData = serializeMessage(this.idConnect, SocketType.MessageDelete, {
      message: {
        id,
      },
    });
    return socketService.sendSocketMessage(userData);
  }

  public readMsg(id: string) {
    const userData = serializeMessage(this.idConnect, SocketType.MessageRead, {
      message: {
        id,
      },
    });
    return socketService.sendSocketMessage(userData);
  }
}
