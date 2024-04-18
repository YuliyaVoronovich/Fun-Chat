import { socketService } from './websocket-service';

class MessageService {
  public sendMsg(text: string, getter: string) {
    socketService.sendMsg('222', text, getter).catch(() => {});
  }
}
export const messageService = new MessageService();
