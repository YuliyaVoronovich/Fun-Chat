import './about-page.scss';
import { socketService } from '../../services/websocket-service';
import { Button } from '../../components/button/button';
import { BaseComponent } from '../../components/base-component';
import { Link } from '../../components/link/link';
import { Modal } from '../../components/modal/modal';

const text = 'An application Fun Chat for fun communication with friends';

export class AboutPage extends BaseComponent {
  private btnClose: Button;

  private readonly modal = new Modal();

  private redirect = window.history.back();

  constructor() {
    super({ tag: 'div', className: 'wrapper about-wrapper' });
    const desc = new BaseComponent({ tag: 'main', className: 'main', textContent: text });
    const author = new Link({
      className: 'author',
      textContent: 'YuliyaVoronovich',
      href: 'https://github.com/yuliyavoronovich',
      target: '_blank',
    });
    this.btnClose = new Button({
      className: 'btn btn-danger',
      type: 'button',
      textContent: 'Back',
      onClick: () => this.redirect,
    });

    this.appendChildren([desc, author, this.btnClose, this.modal]);

    socketService.error$.subscribe('error', (payload) => {
      this.modal.alertMess(payload.error, 'danger');
    });
    socketService.connection$.subscribe('connection', () => {
      this.modal.closeModal();
    });
  }
}
