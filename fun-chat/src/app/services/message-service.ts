import { socketService } from './websocket-service';

class MessageService {
  public sendMsg(text: string, getter: string) {
    socketService.sendMsg('222', text, getter).catch(() => {});
  }

  public getHistoryMsg(login: string) {
    socketService.getHistoryMsg('222', login).catch(() => {});
  }
}
export const messageService = new MessageService();
