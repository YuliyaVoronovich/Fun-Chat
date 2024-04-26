// import type { MessageForm } from '../../../components/message-form/message-form';
import { BaseComponent } from '../../../components/base-component';
import { MessageService } from '../../../services/message-service';

export class Chat extends BaseComponent {
  private readonly messageService = new MessageService();

  private chatHeader = new BaseComponent({ tag: 'div', className: 'chat-header' });

  private chatHeaderStatus = new BaseComponent({ tag: 'span', className: 'status-in-chat' });

  private chatFooter = new BaseComponent({ tag: 'div', className: 'chat-footer' });

  private isStartChat = false;

  private chatMainPlaceholder = new BaseComponent({
    tag: 'div',
    className: 'chat-main-placeholder',
    textContent: 'Select a user to send a message...',
  });

  private chatMain = new BaseComponent({
    tag: 'div',
    className: 'chat-main custom-scrolbar',
  });

  // private messageForm: MessageForm;

  constructor() {
    super({ tag: 'div', className: 'chat card' });
    //   this.messageForm = new MessageForm(this.sendMessage);
    //   this.chatMain.appendChildren([this.chatMainPlaceholder]);
    //   this.chatMain.addListener('click', this.clickChatMain);
    //   this.chatMain.addListener('wheel', this.clickChatMain);
    //   this.chatHeader.appendChildren([this.chatHeaderStatus]);
    //   this.chatFooter.appendChildren([this.messageForm]);
    //   this.appendChildren([this.chatHeader, this.chatMain, this.chatFooter]);
    // }

    // private sendMessage = (idMsg: string, text: string, isEdit: boolean) => {
    //   if (!this.isStartChat) {
    //     this.chatMainPlaceholder.destroy();
    //     this.isStartChat = true;
    //   }
    //   if (isEdit) {
    //     this.messageService.editMsg(idMsg, text).catch((error: Error) => {
    //       throw new Error(error.message);
    //     });
    //     this.messageForm.removeInputColor();
    //     this.messageForm.editForm = false;
    //   } else {
    //     this.messageService.sendMsg(text, this.selectedUser).catch((error: Error) => {
    //       throw new Error(error.message);
    //     });
    //     this.sendReadMessage();
    //   }
    //   this.getHistoryFromUser(this.selectedUser);

    //   this.messageForm.resetInputMessage();
    //   this.messageForm.changeStatusBtn('');
    // };

    // private clickChatMain = () => {
    //   this.destroyMenuMsg();
    //   this.sendReadMessage();
    // };
  }
}
