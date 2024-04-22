import { socketService } from './websocket-service';

const idConnect = '222';

class MessageService {
  public sendMsg(text: string, getter: string) {
    socketService.sendMsg(idConnect, text, getter).catch(() => {});
  }

  public editMsg(idMsg: string, text: string) {
    socketService.editMsg(idConnect, idMsg, text).catch(() => {});
  }

  public getHistoryMsg(login: string) {
    socketService.getHistoryMsg(idConnect, login).catch(() => {});
  }

  public deleteMsg(id: string) {
    socketService.deleteMsg(idConnect, id).catch(() => {});
  }
}
export const messageService = new MessageService();
