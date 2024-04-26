import './chat-page.scss';
import type { IMessage, IUserLoginned, UnreadMesObj } from 'src/app/interfaces.ts/sockets';
import { socketService } from '../../services/websocket-service';
import { Message } from './message/message';
import { MessageForm } from '../../components/message-form/message-form';
import { Header } from '../../components/header/header';
import { BaseComponent } from '../../components/base-component';
import { Footer } from '../../components/footer/footer';
import { UserService } from '../../services/user-services';
import { sessionStorageService } from '../../services/session-service';
import { Input } from '../../components/input/input';

import { User } from './user/user';
import { MessageService } from '../../services/message-service';
import { Modal } from '../../components/modal/modal';
import { ContextMenu } from './context-menu/context-menu';

const TOP_VALUE_CONTEXT_MENU = 40;

export class ChatPage extends BaseComponent {
  private readonly messageService = new MessageService();

  private readonly userService = new UserService();

  private currentUser = sessionStorageService.getUser('user')?.login;

  private isSelectedUser = false;

  private selectedUser = '';

  private userItems: User[] = [];

  private header = new Header();

  private footer = new Footer();

  private main = new BaseComponent({ tag: 'main', className: 'main' });

  private search: Input;

  private aside = new BaseComponent({ tag: 'aside', className: 'aside card' });

  private usersWrapper = new BaseComponent({ tag: 'ul', className: 'users-link' });

  private chat = new BaseComponent({ tag: 'div', className: 'chat card' });

  private chatHeader = new BaseComponent({ tag: 'div', className: 'chat-header' });

  private chatHeaderStatus = new BaseComponent({ tag: 'span', className: 'status-in-chat' });

  private chatFooter = new BaseComponent({ tag: 'div', className: 'chat-footer' });

  private messageForm: MessageForm;

  private userMessages: Message[] = [];

  private chatMainPlaceholder = new BaseComponent({
    tag: 'div',
    className: 'chat-main-placeholder',
    textContent: 'Select a user to send a message...',
  });

  private chatMain = new BaseComponent({
    tag: 'div',
    className: 'chat-main custom-scrolbar',
  });

  private isStartChat = false;

  private usersActive: IUserLoginned[] = [];

  private usersInActive: IUserLoginned[] = [];

  private readonly modal = new Modal();

  private newContext: ContextMenu;

  private breakLine: BaseComponent;

  private isBreakLine = false;

  private unreadMesObj: UnreadMesObj = {};

  constructor() {
    super({ tag: 'div', className: 'chat-wrapper' });
    this.search = new Input({
      type: 'text',
      className: 'form-control',
      placeholder: 'Search...',
      onInput: this.searchUser,
    });

    this.messageForm = new MessageForm(this.sendMessage);
    this.breakLine = new BaseComponent({ tag: 'div', className: 'break-line hide', textContent: 'unread messages' });

    this.chatFooter.appendChildren([this.messageForm]);
    this.chatHeader.appendChildren([this.chatHeaderStatus]);
    this.chatMain.appendChildren([this.chatMainPlaceholder]);
    this.chatMain.addListener('click', this.clickChatMain);
    this.chatMain.addListener('wheel', this.clickChatMain);
    this.chat.appendChildren([this.chatHeader, this.chatMain, this.chatFooter]);
    this.aside.appendChildren([this.search, this.usersWrapper]);
    this.main.appendChildren([this.aside, this.chat]);
    this.appendChildren([this.header, this.main, this.footer, this.modal]);
    this.newContext = new ContextMenu('0', '', this.editMsg, this.deleteMsg);
    this.userService.reLogin();
    this.userService.allActiveUsers().catch((error: Error) => {
      throw new Error(error.message);
    });
    this.userService.allInActiveUsers().catch((error: Error) => {
      throw new Error(error.message);
    });
    this.subscribesUsers();
    this.subscribesMessages();
    socketService.error$.subscribe('error', (payload) => {
      this.modal.alertMess(payload.error, 'danger');
    });
    socketService.connection$.subscribe('connection', () => {
      this.modal.closeModal();
    });
  }

  private subscribesUsers = () => {
    socketService.usersActive$.subscribe('usersActive', (payload) => {
      this.usersActive = [];
      payload.users.forEach((item) => {
        if (item.login !== this.currentUser) {
          this.usersActive.push(item);
          this.getHistoryFromUser(item.login);
        }
      });
      this.showUsers(this.usersActive);
    });
    socketService.usersInActive$.subscribe('usersInActive', (payload) => {
      this.usersInActive = [];
      payload.users.forEach((item) => {
        this.usersInActive.push(item);
        this.getHistoryFromUser(item.login);
      });
      this.showUsers(this.usersInActive);
    });
    socketService.userExternalLogin$.subscribe('userExternalLogin', (payload) => {
      this.updateUsersAfterExternalLogin(payload);
    });
    socketService.userExternalLogout$.subscribe('userExternalLogout', (payload) => {
      this.updateUsersAfterExternalLogin(payload);
    });
  };

  // eslint-disable-next-line
  private subscribesMessages = () => {
    socketService.messageReceived$.subscribe('messageReceived', (payload) => {
      const { to, from } = payload;
      if (
        (this.currentUser === from && this.selectedUser === to) ||
        (this.currentUser === to && this.selectedUser === from)
      ) {
        const msg = this.addNewMessage(payload);

        if (!this.isStartChat) {
          this.chatMainPlaceholder.destroy();
          this.isStartChat = true;
        }
        if (msg) {
          this.userMessages.push(msg);
          this.chatMain.appendChildren([msg]);
        }

        if (this.isBreakLine) {
          this.breakLine.getNode().scrollIntoView();
        } else {
          this.chatMain.setScrollTop();
        }
      } else {
        this.getHistoryFromUser(from);
      }
    });
    socketService.messageHistory$.subscribe('messageHistory', (payload) => {
      if (this.isSelectedUser) {
        this.chatMain.destroyChildren();
        if (payload.messages.length > 0) {
          this.userMessages = [];
          payload.messages.forEach((message) => {
            const msg = this.addNewMessage(message);
            if (msg) {
              this.userMessages.push(msg);
            }
          });
          this.chatMain.appendChildren([...this.userMessages]);
          if (this.isBreakLine) {
            this.breakLine.getNode().scrollIntoView();
          } else {
            this.chatMain.setScrollTop();
          }
        } else {
          this.chatMainPlaceholder.removeClass('hide');
          this.chatMainPlaceholder.setTextContent('Start dialog...');
          this.chatMain.appendChildren([this.chatMainPlaceholder]);
        }
      } // else {
      payload.messages.forEach((message) => {
        this.unreadMesObj[message.from] = payload.messages
          .filter((item) => item.to === this.currentUser)
          .filter((item) => !item.status.isReaded).length;
      });
      this.usersWrapper.destroyChildren();
      this.showUsers([...this.usersActive, ...this.usersInActive]);
      // }
    });
    socketService.messageDeliver$.subscribe('messageDeliver', (payload) => {
      this.userMessages.forEach((userMsg) => {
        if (userMsg.getAttribute('id') === payload.message.id) {
          userMsg.updateStatus({
            isDelivered: payload.message.isDelivered,
            isEdited: userMsg.currentStatus.isEdited,
            isReaded: userMsg.currentStatus.isReaded,
          });
        }
      });
    });
    socketService.messageRead$.subscribe('messageRead', (payload) => {
      this.userMessages.forEach((userMsg) => {
        if (userMsg && userMsg.getAttribute('id') === payload.message.id) {
          userMsg.updateStatus({
            isDelivered: userMsg.currentStatus.isDelivered,
            isEdited: userMsg.currentStatus.isEdited,
            isReaded: payload.message.isReaded,
          });
        }
      });
    });
    socketService.messageEdit$.subscribe('messageEdit', (payload) => {
      this.userMessages.forEach((userMsg) => {
        if (userMsg.getAttribute('id') === payload.message.id) {
          userMsg.updateText(payload.message.text);
          userMsg.updateStatus({
            isDelivered: userMsg.currentStatus.isDelivered,
            isEdited: payload.message.isEdited,
            isReaded: userMsg.currentStatus.isReaded,
          });
        }
      });
    });
    socketService.messageDelete$.subscribe('messageDelete', (payload) => {
      this.userMessages.forEach((userMsg) => {
        if (userMsg.getAttribute('id') === payload.message.id) {
          userMsg.destroy();
          this.userMessages.splice(this.userMessages.indexOf(userMsg), 1);
          this.newContext.destroy();
        }
      });
    });
  };

  private updateUsersAfterExternalLogin = (payload: IUserLoginned) => {
    this.usersWrapper.destroyChildren();
    this.userService.allActiveUsers().catch((error: Error) => {
      throw new Error(error.message);
    });
    this.userService.allInActiveUsers().catch((error: Error) => {
      throw new Error(error.message);
    });
    this.changeStatusOfSelectedUser(payload);
  };

  private showUsers = (users: IUserLoginned[]) => {
    this.userItems = users.map(
      (user) => new User(user.login, user.isLogined, this.unreadMesObj[user.login], this.getUser),
    );
    this.usersWrapper.appendChildren([...this.userItems]);
  };

  private searchUser = (value: string) => {
    const searchArray = [...this.usersActive, ...this.usersInActive].filter((user) =>
      user.login.toLowerCase().includes(value.toLowerCase()),
    );
    this.usersWrapper.destroyChildren();
    this.showUsers(searchArray);
  };

  private getUser = (value: IUserLoginned) => {
    this.isSelectedUser = true;
    this.selectedUser = value.login;
    const status = value.isLogined ? 'online' : 'offline';
    this.chatHeaderStatus.toggleClass(`active`, value.isLogined);
    this.chatHeaderStatus.setTextContent(status);
    this.chatHeader.setTextContent(value.login);
    this.chatMainPlaceholder.setTextContent(`Write your first message...`);
    this.chatHeader.appendChildren([this.chatHeaderStatus]);
    this.messageForm.changeInputStatus();
    this.isBreakLine = false;
    this.userMessages = [];

    this.getHistoryFromUser(value.login);
  };

  private changeStatusOfSelectedUser = (value: IUserLoginned) => {
    if (this.isSelectedUser) {
      const status = value.isLogined ? 'online' : 'offline';
      this.chatHeaderStatus.toggleClass(`active`, value.isLogined);
      this.chatHeaderStatus.setTextContent(`${status}`);
    }
  };

  private addNewMessage = (payload: IMessage) => {
    const { id, text, to, from, datetime, status } = payload;
    let newMsg: Message | undefined;
    if (
      (this.currentUser === from && this.selectedUser === to) ||
      (this.currentUser === to && this.selectedUser === from)
    ) {
      newMsg = new Message({
        id,
        text,
        from,
        to,
        datetime,
        status: { isDelivered: status.isDelivered, isEdited: status.isEdited, isReaded: status.isReaded },
        onContext: this.contextMenuMsg,
        onClick: this.destroyMenuMsg,
      });

      if (!payload.status.isReaded && !this.isBreakLine && this.currentUser === to) {
        this.breakLine.addClass('show');
        newMsg.prepend(this.breakLine);
        this.breakLine.getNode().scrollIntoView();
        this.isBreakLine = true;
      }
    }
    return newMsg;
  };

  private sendMessage = (idMsg: string, text: string, isEdit: boolean) => {
    if (!this.isStartChat) {
      this.chatMainPlaceholder.destroy();
      this.isStartChat = true;
    }
    if (isEdit) {
      this.messageService.editMsg(idMsg, text).catch((error: Error) => {
        throw new Error(error.message);
      });
      this.messageForm.removeInputColor();
      this.messageForm.editForm = false;
    } else {
      this.messageService.sendMsg(text, this.selectedUser).catch((error: Error) => {
        throw new Error(error.message);
      });
      this.sendReadMessage();
    }
    this.getHistoryFromUser(this.selectedUser);

    this.messageForm.resetInputMessage();
    this.messageForm.changeStatusBtn('');
  };

  private getHistoryFromUser = (value: string) => {
    this.messageService.getHistoryMsg(value).catch((error: Error) => {
      throw new Error(error.message);
    });
  };

  private contextMenuMsg = (message: Message, id: string, author: string) => {
    if (author === this.currentUser) {
      this.newContext.destroy();
      const newContext = new ContextMenu(id, message.text, this.editMsg, this.deleteMsg);
      this.newContext = newContext;
      this.chatMain.appendChildren([this.newContext]);
      const offsetTop = Number(message.getNodeProperty('offsetTop'));
      this.newContext.setStyle('top', `${offsetTop + TOP_VALUE_CONTEXT_MENU}px`);
    }
  };

  private sendReadMessage = () => {
    this.userMessages.forEach((userMsg) => {
      const id = userMsg.getAttribute('id');
      if (id && userMsg.sender === this.selectedUser) {
        this.messageService.readMsg(id).catch((error: Error) => {
          throw new Error(error.message);
        });
      }
    });
    this.userItems.forEach((item) => {
      if (item.user.login === this.selectedUser) {
        const selectUser = item;
        selectUser.countUnReadMsg = '';
      }
    });
    this.breakLine.destroy();
    this.isBreakLine = false;
  };

  private clickChatMain = () => {
    this.destroyMenuMsg();
    this.sendReadMessage();
  };

  private destroyMenuMsg = () => {
    this.newContext.destroy();
  };

  private editMsg = (id: string, text: string) => {
    this.messageForm.editForm = true;
    this.messageForm.IdMsg = id;
    this.messageForm.setValueTextMsg(text);
    this.messageForm.setInputColor();
    this.messageForm.changeStatusBtn('true');
  };

  private deleteMsg = (id: string) => {
    this.messageService.deleteMsg(id).catch((error: Error) => {
      throw new Error(error.message);
    });
  };
}
