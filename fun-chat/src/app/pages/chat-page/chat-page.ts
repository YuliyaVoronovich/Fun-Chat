import './chat-page.scss';
import type { IUserLoginned } from 'src/app/interfaces.ts/sockets';
import { Message } from '../../components/message/message';
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

  constructor() {
    super({ tag: 'div', className: 'chat-wrapper' });
    this.search = new Input({
      type: 'text',
      className: 'form-control',
      placeholder: 'Search...',
      onInput: this.searchUser,
    });

    this.messageForm = new MessageForm(this.getTextMessage);

    this.chatFooter.appendChildren([this.messageForm]);
    this.chatHeader.appendChildren([this.chatHeaderStatus]);
    this.chatMain.appendChildren([this.chatMainPlaceholder]);
    this.chat.appendChildren([this.chatHeader, this.chatMain, this.chatFooter]);
    this.aside.appendChildren([this.search, this.usersWrapper]);
    this.main.appendChildren([this.aside, this.chat]);
    this.appendChildren([this.header, this.main, this.footer, this.modal]);
    userService.reLogin();
    userService.allActiveUsers();
    userService.allInActiveUsers();
    this.subscribesUsers();
    this.subscribesMessages();
    pubSub.subscribe('error', (payload) => {
      console.log(payload);
      this.modal.alertMess(payload.error, 'danger');
    });
    pubSub.subscribe('connection', (payload) => {
      console.log(payload);
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
      this.usersWrapper.destroyChildren();
      userService.allActiveUsers();
      userService.allInActiveUsers();
      this.changeStatusOfSelectedUser(payload);
    });
    pubSub.subscribe('userExternalLogout', (payload) => {
      this.usersWrapper.destroyChildren();
      userService.allActiveUsers();
      userService.allInActiveUsers();
      this.changeStatusOfSelectedUser(payload);
    });
  };

  private subscribesMessages = () => {
    pubSub.subscribe('messageReceived', (payload) => {
      const { text, to, from, datetime, status } = payload;
      if (this.currentUser === from || (this.currentUser === to && this.selectedUser === from)) {
        const msg = new Message({
          text,
          from,
          to,
          datetime,
          status: { isDelivered: status.isDelivered, isEdited: status.isEdited, isReaded: status.isReaded },
        });
        if (!this.isStartChat) {
          this.chatMainPlaceholder.addClass('hide');
          this.isStartChat = true;
        }
        this.chatMain.appendChildren([msg]);
      } else {
        this.getHistoryFromUser(from);
      }
    });
    pubSub.subscribe('messageHistory', (payload) => {
      if (this.isSelectedUser && payload.messages.length > 0) {
        this.chatMain.destroyChildren();
        this.userMessages = payload.messages.map(
          (message) =>
            new Message({ text: message.text, from: message.from, datetime: message.datetime, status: message.status }),
        );
        this.chatMain.appendChildren([...this.userMessages]);
      } else {
        console.log(this.countUnReadMessages);
        this.countUnReadMessages.push(
          payload.messages.filter((item) => item.to === this.currentUser).filter((item) => !item.status.isReaded)
            .length,
        );
        this.usersWrapper.destroyChildren();
        this.showUsers([...this.usersActive, ...this.usersInActive]);
      }
    });
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

  private getTextMessage = (text: string) => {
    if (!this.isStartChat) {
      this.chatMainPlaceholder.addClass('hide');
      this.isStartChat = true;
    }
    messageService.sendMsg(text, this.selectedUser);
    this.messageForm.resetInputMessage();
    this.messageForm.changeStatusBtn('');
  };

  private getHistoryFromUser = (value: string) => {
    messageService.getHistoryMsg(value);
  };
}
