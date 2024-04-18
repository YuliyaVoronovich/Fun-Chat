import './chat-page.scss';
import type { IsUserLogin } from 'src/app/interfaces.ts/sockets';
import { Message } from '../../components/message/message';
import { MessageForm } from '../../components/message-form/message-form';
import { Header } from '../../components/header/header';
import { BaseComponent } from '../../components/base-component';
import { Footer } from '../../components/footer/footer';
import { socketService } from '../../services/websocket-service';
import { userService } from '../../services/user-services';
import { sessionStorageInst } from '../../services/session-service';
import { Input } from '../../components/input/input';
import { pubSub } from '../../utils/pub-sub';
import { User } from './user/user';
import { messageService } from '../../services/message-service';

export class ChatPage extends BaseComponent {
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

  private usersActive: IsUserLogin[] = [];

  private usersInActive: IsUserLogin[] = [];

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
    this.appendChildren([this.header, this.main, this.footer]);
    this.reLogin();
    userService.allActiveUsers();
    userService.allInActiveUsers();
    this.subscribesUsers();
    this.subscribesMessages();
  }

  private subscribesUsers = () => {
    pubSub.subscribe('usersActive', (payload) => {
      this.usersActive = [];
      payload.users.forEach((item) => {
        if (item.login !== sessionStorageInst.getUser('user')?.login) {
          this.usersActive.push(item);
        }
      });
      this.showUsers(this.usersActive);
    });
    pubSub.subscribe('usersInActive', (payload) => {
      this.usersInActive = [];
      payload.users.forEach((item) => {
        this.usersInActive.push(item);
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
      const { text, to, from, datetime } = payload;
      if (
        sessionStorageInst.getUser('user')?.login === from ||
        (sessionStorageInst.getUser('user')?.login === to && this.selectedUser === from)
      ) {
        const msg = new Message({
          text,
          from,
          to,
          datetime,
          status: { isDelivered: true, isEdited: true, isReaded: true },
        });
        if (!this.isStartChat) {
          this.chatMainPlaceholder.addClass('hide');
          this.isStartChat = true;
        }
        this.chatMain.appendChildren([msg]);
      }
    });
  };

  private reLogin = () => {
    if (sessionStorageInst.checkUser('user')) {
      const login = sessionStorageInst.getUser('user')?.login;
      const password = sessionStorageInst.getUser('user')?.password;
      if (login && password) {
        socketService.socket.onopen = () => {
          userService.login(login, password);
          userService.allActiveUsers();
          userService.allInActiveUsers();
        };
      }
    }
  };

  private showUsers = (users: IsUserLogin[]) => {
    this.userItems = users.map((user) => new User(user.login, user.isLogined, this.getUser));
    this.usersWrapper.appendChildren([...this.userItems]);
  };

  private searchUser = (value: string) => {
    const searchArray = [...this.usersActive, ...this.usersInActive].filter((user) =>
      user.login.toLowerCase().includes(value.toLowerCase()),
    );
    this.usersWrapper.destroyChildren();
    this.showUsers(searchArray);
  };

  private getUser = (value: IsUserLogin) => {
    this.isSelectedUser = true;
    this.selectedUser = value.login;
    const status = value.isLogined ? 'online' : 'offline';
    this.chatHeaderStatus.toggleClass(`active`, value.isLogined);
    this.chatHeaderStatus.setTextContent(`${status}`);
    this.chatHeader.setTextContent(`${value.login}`);
    this.chatMainPlaceholder.setTextContent(`Write your first message...`);
    this.chatHeader.appendChildren([this.chatHeaderStatus]);
    this.messageForm.changeInputStatus();
  };

  private changeStatusOfSelectedUser = (value: IsUserLogin) => {
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
  };
}
