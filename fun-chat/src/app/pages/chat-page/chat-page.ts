import './chat-page.scss';
import type { IsUserLogin } from 'src/app/interfaces.ts/sockets';
import { Header } from '../../components/header/header';
import { BaseComponent } from '../../components/base-component';
import { Footer } from '../../components/footer/footer';
import { socketService } from '../../services/websocket-service';
import { userService } from '../../services/user-services';
import { sessionStorageInst } from '../../services/session-service';
import { Input } from '../../components/input/input';
import { pubSub } from '../../utils/pub-sub';
import { User } from './user/user';

export class ChatPage extends BaseComponent {
  private userItems: User[] = [];

  private header = new Header();

  private footer = new Footer();

  private main = new BaseComponent({ tag: 'main', className: 'main' });

  private search: Input;

  private aside = new BaseComponent({ tag: 'aside', className: 'aside card' });

  private usersWrapper = new BaseComponent({ tag: 'ul', className: 'users-link' });

  private chat = new BaseComponent({ tag: 'div', className: 'chat card' });

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
    this.aside.appendChildren([this.search, this.usersWrapper]);
    this.main.appendChildren([this.aside, this.chat]);
    this.appendChildren([this.header, this.main, this.footer]);
    this.reLogin();
    userService.allActiveUsers();
    userService.allInActiveUsers();
    this.subsribes();
  }

  private subsribes = () => {
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
    pubSub.subscribe('userExternalLogin', () => {
      this.usersWrapper.destroyChildren();
      userService.allActiveUsers();
      userService.allInActiveUsers();
    });
    pubSub.subscribe('userExternalLogout', () => {
      this.usersWrapper.destroyChildren();
      userService.allActiveUsers();
      userService.allInActiveUsers();
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
    this.userItems = users.map((user) => new User(user.login, user.isLogined));
    this.usersWrapper.appendChildren([...this.userItems]);
  };

  private searchUser = (value: string) => {
    const searchArray = [...this.usersActive, ...this.usersInActive].filter((user) =>
      user.login.toLowerCase().includes(value.toLowerCase()),
    );
    this.usersWrapper.destroyChildren();
    this.showUsers(searchArray);
  };
}
