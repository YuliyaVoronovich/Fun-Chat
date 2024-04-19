import './about-page.scss';
import { Button } from '../../components/button/button';
import { BaseComponent } from '../../components/base-component';
import { Link } from '../../components/link/link';
import { pubSub } from '../../utils/pub-sub';
import { Modal } from '../../components/modal/modal';

const text = 'An application Fun Chat for fun communication with friends';

export class AboutPage extends BaseComponent {
  private btnClose: Button;

  private readonly modal = new Modal();

  constructor() {
    super({ tag: 'div', className: 'wrapper about-wrapper' });
    const desc = new BaseComponent({ tag: 'main', className: 'main', textContent: text });
    const author = new Link({
      className: 'author',
      textContent: 'YuliyaVoronovich',
      href: 'https://github.com/yuliyavoronovich',
    });
    this.btnClose = new Button({
      className: 'btn btn-danger',
      type: 'button',
      textContent: 'Back',
      onClick: this.goToBack,
    });

    this.appendChildren([desc, author, this.btnClose, this.modal]);

    pubSub.subscribe('error', (payload) => {
      this.modal.alertMess(payload.error, 'danger');
    });
    pubSub.subscribe('connection', (payload) => {
      console.log(payload);
      this.modal.closeModal();
    });
  }

  private goToBack = () => {
    window.history.back();
  };
}
