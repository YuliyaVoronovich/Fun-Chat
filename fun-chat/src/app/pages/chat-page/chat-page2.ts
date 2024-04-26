import { Input } from '../../components/input/input';
import { BaseComponent } from '../../components/base-component';
import { Header } from '../../components/header/header';
import { Footer } from '../../components/footer/footer';
import { Modal } from '../../components/modal/modal';

export class ChatPage2 extends BaseComponent {
  private search: Input;

  private header = new Header();

  private footer = new Footer();

  private main = new BaseComponent({ tag: 'main', className: 'main' });

  private readonly modal = new Modal();

  constructor() {
    super({ tag: 'div', className: 'chat-wrapper' });
    this.search = new Input({
      type: 'text',
      className: 'form-control',
      placeholder: 'Search...',
      // onInput: this.searchUser,
    });

    this.appendChildren([this.header, this.main, this.footer, this.modal]);
  }
}
