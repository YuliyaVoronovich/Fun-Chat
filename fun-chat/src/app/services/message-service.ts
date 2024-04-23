import { socketService } from './websocket-service';

const idConnect = '222';

class MessageService {
  public sendMsg(text: string, getter: string) {
    socketService.sendMsg(idConnect, text, getter).catch((error: Error) => {
      throw new Error(error.message);
    });
  }

  public editMsg(idMsg: string, text: string) {
    socketService.editMsg(idConnect, idMsg, text).catch((error: Error) => {
      throw new Error(error.message);
    });
  }

  public getHistoryMsg(login: string) {
    socketService.getHistoryMsg(idConnect, login).catch((error: Error) => {
      throw new Error(error.message);
    });
  }

  public deleteMsg(id: string) {
    socketService.deleteMsg(idConnect, id).catch((error: Error) => {
      throw new Error(error.message);
    });
  }

  public readMsg(id: string) {
    socketService.readMsg(idConnect, id).catch((error: Error) => {
      throw new Error(error.message);
    });
  }
}
export const messageService = new MessageService();
