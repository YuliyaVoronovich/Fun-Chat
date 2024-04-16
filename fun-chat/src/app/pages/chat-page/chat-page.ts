import './chat-page.scss';
import { Header } from '../../components/header/header';
import { BaseComponent } from '../../components/base-component';
import { Footer } from '../../components/footer/footer';

export class ChatPage extends BaseComponent {
  private header = new Header();

  private footer = new Footer();

  private main = new BaseComponent({ tag: 'main', className: 'main' });

  private aside = new BaseComponent({ tag: 'aside', className: 'aside card' });

  private chat = new BaseComponent({ tag: 'div', className: 'chat card' });

  constructor() {
    super({ tag: 'div', className: 'chat-wrapper' });
    this.main.appendChildren([this.aside, this.chat]);
    this.appendChildren([this.header, this.main, this.footer]);
  }
}
