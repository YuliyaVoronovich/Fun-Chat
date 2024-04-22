import './chat-page.scss';
import type { IMessage, IUserLoginned } from 'src/app/interfaces.ts/sockets';
import { Message } from './message/message';
import { MessageForm } from '../../components/message-form/message-form';
import { Header } from '../../components/header/header';
import { BaseComponent } from '../../components/base-component';
import { Footer } from '../../components/footer/footer';
import { userService } from '../../services/user-services';
import { sessionStorageInst } from '../../services/session-service';
import { Input } from '../../components/input/input';
import { pubSub } from '../../utils/pub-sub';
import { User } from './user/user';
import { messageService } from '../../services/message-service';
import { Modal } from '../../components/modal/modal';
import { ContextMenu } from './context-menu/context-menu';

const TOP_VALUE_CONTEXT_MENU = 40;

export class ChatPage extends BaseComponent {
  private currentUser = sessionStorageInst.getUser('user')?.login;

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

  private countUnReadMessages: number[] = [];

  private chatMainPlaceholder = new BaseComponent({
    tag: 'div',
    className: 'chat-main-placeholder',
    textContent: 'Select a user to send a message...',
  });

  private chatMain = new BaseComponent({
    tag: 'div',
    className: 'chat-main',
  });

  private isStartChat = false;

  private usersActive: IUserLoginned[] = [];

  private usersInActive: IUserLoginned[] = [];

  private readonly modal = new Modal();

  private newContext: ContextMenu;

  constructor() {
    super({ tag: 'div', className: 'chat-wrapper' });
    this.search = new Input({
      type: 'text',
      className: 'form-control',
      placeholder: 'Search...',
      onInput: this.searchUser,
    });

    this.messageForm = new MessageForm(this.sendMessage);

    this.chatFooter.appendChildren([this.messageForm]);
    this.chatHeader.appendChildren([this.chatHeaderStatus]);
    this.chatMain.appendChildren([this.chatMainPlaceholder]);
    this.chatMain.addListener('click', this.clickChatMain);
    this.chatMain.addListener('scroll', this.clickChatMain);
    this.chat.appendChildren([this.chatHeader, this.chatMain, this.chatFooter]);
    this.aside.appendChildren([this.search, this.usersWrapper]);
    this.main.appendChildren([this.aside, this.chat]);
    this.appendChildren([this.header, this.main, this.footer, this.modal]);
    this.newContext = new ContextMenu('0', '', this.editMsg, this.deleteMsg);
    userService.reLogin();
    userService.allActiveUsers();
    userService.allInActiveUsers();
    this.subscribesUsers();
    this.subscribesMessages();
    pubSub.subscribe('error', (payload) => {
      this.modal.alertMess(payload.error, 'danger');
    });
    pubSub.subscribe('connection', () => {
      this.modal.closeModal();
    });
  }

  private subscribesUsers = () => {
    pubSub.subscribe('usersActive', (payload) => {
      this.usersActive = [];
      payload.users.forEach((item) => {
        if (item.login !== this.currentUser) {
          this.usersActive.push(item);
          this.getHistoryFromUser(item.login);
        }
      });
      this.showUsers(this.usersActive);
    });
    pubSub.subscribe('usersInActive', (payload) => {
      this.usersInActive = [];
      payload.users.forEach((item) => {
        this.usersInActive.push(item);
        this.getHistoryFromUser(item.login);
      });
      this.showUsers(this.usersInActive);
    });
    pubSub.subscribe('userExternalLogin', (payload) => {
      this.updateUsersAfterExternalLogin(payload);
    });
    pubSub.subscribe('userExternalLogout', (payload) => {
      this.updateUsersAfterExternalLogin(payload);
    });
  };
  // eslint-disable-next-line
  private subscribesMessages = () => {
    pubSub.subscribe('messageReceived', (payload) => {
      const { to, from } = payload;
      if (this.currentUser === from || (this.currentUser === to && this.selectedUser === from)) {
        const msg = this.addNewMessage(payload);
        if (!this.isStartChat) {
          this.chatMainPlaceholder.addClass('hide');
          this.isStartChat = true;
        }
        if (msg) {
          this.userMessages.push(msg);
          this.chatMain.appendChildren([msg]);
        }

        this.chatMain.setScrollTop();
      } else {
        this.getHistoryFromUser(from);
      }
    });
    pubSub.subscribe('messageHistory', (payload) => {
      if (this.isSelectedUser) {
        this.chatMain.destroyChildren();
        this.userMessages = payload.messages.map((message) => {
          return this.addNewMessage(message);
        });
        this.chatMain.appendChildren([...this.userMessages]);
        this.chatMain.setScrollTop();
      }
      // this.getCountUnReadMessages();
      else {
        this.countUnReadMessages.push(
          payload.messages.filter((item) => item.to === this.currentUser).filter((item) => !item.status.isReaded)
            .length,
        );
        this.usersWrapper.destroyChildren();
        this.showUsers([...this.usersActive, ...this.usersInActive]);
      }
    });
    pubSub.subscribe('messageDeliver', (payload) => {
      this.userMessages.forEach((userMsg) => {
        if (userMsg.getAttribute('id') === payload.message.id) {
          userMsg.updateStatus({ isDelivered: payload.message.isDelivered, isEdited: false, isReaded: false });
        }
      });
    });
    pubSub.subscribe('messageRead', (payload) => {
      this.userMessages.forEach((userMsg) => {
        if (userMsg && userMsg.getAttribute('id') === payload.message.id) {
          userMsg.updateStatus({ isDelivered: false, isEdited: false, isReaded: payload.message.isReaded });
        }
      });
    });
    pubSub.subscribe('messageEdit', (payload) => {
      this.userMessages.forEach((userMsg) => {
        if (userMsg.getAttribute('id') === payload.message.id) {
          userMsg.updateText(payload.message.text);
          userMsg.updateStatus({ isDelivered: false, isEdited: payload.message.isEdited, isReaded: false });
        }
      });
    });
    pubSub.subscribe('messageDelete', (payload) => {
      this.userMessages.forEach((userMsg) => {
        if (userMsg.getAttribute('id') === payload.message.id) {
          userMsg.destroy();
          delete this.userMessages[this.userMessages.indexOf(userMsg)];
          this.newContext.destroy();
        }
      });
    });
  };

  private updateUsersAfterExternalLogin = (payload: IUserLoginned) => {
    this.usersWrapper.destroyChildren();
    userService.allActiveUsers();
    userService.allInActiveUsers();
    this.changeStatusOfSelectedUser(payload);
  };

  private showUsers = (users: IUserLoginned[]) => {
    this.userItems = users.map(
      (user, index) => new User(user.login, user.isLogined, this.countUnReadMessages[index], this.getUser),
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
    this.chatHeaderStatus.setTextContent(`${status}`);
    this.chatHeader.setTextContent(`${value.login}`);
    this.chatMainPlaceholder.setTextContent(`Write your first message...`);
    this.chatHeader.appendChildren([this.chatHeaderStatus]);
    this.messageForm.changeInputStatus();

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
    return new Message({
      id,
      text,
      from,
      to,
      datetime,
      status: { isDelivered: status.isDelivered, isEdited: status.isEdited, isReaded: status.isReaded },
      onContext: this.contextMenuMsg,
      onClick: this.destroyMenuMsg,
    });
  };

  private sendMessage = (idMsg: string, text: string, isEdit: boolean) => {
    if (!this.isStartChat) {
      this.chatMainPlaceholder.addClass('hide');
      this.isStartChat = true;
    }
    if (isEdit) {
      messageService.editMsg(idMsg, text);
      this.messageForm.removeInputColor();
    } else {
      messageService.sendMsg(text, this.selectedUser);
      this.sendReadMessage();
    }

    this.messageForm.resetInputMessage();
    this.messageForm.changeStatusBtn('');
  };

  private getHistoryFromUser = (value: string) => {
    messageService.getHistoryMsg(value);
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
        messageService.readMsg(id);
      }
    });
    this.userItems.forEach((item) => {
      if (item.user.login === this.selectedUser) {
        const selectUser = item;
        selectUser.countUnReadMsg = '';
      }
    });
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
    messageService.deleteMsg(id);
  };
}
