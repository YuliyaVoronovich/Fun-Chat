import { Button } from '../../components/button/button';
import { BaseComponent } from '../../components/base-component';
import './about-page.scss';
import { Link } from '../../components/link/link';

const text = 'An application Fun Chat for fun communication with friends';

export class AboutPage extends BaseComponent {
  private btnClose: Button;

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

    this.appendChildren([desc, author, this.btnClose]);
  }

  private goToBack = () => {
    window.history.back();
  };
}
