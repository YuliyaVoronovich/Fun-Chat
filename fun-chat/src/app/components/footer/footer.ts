import { BaseComponent } from '../base-component';
import { Link } from '../link/link';
import './footer.scss';

export class Footer extends BaseComponent {
  constructor() {
    const author = new Link({
      className: 'author-link',
      textContent: 'YuliyaVoronovich',
      href: 'https://github.com/yuliyavoronovich',
      target: '_blank',
    });

    const logo = new Link({
      className: 'author',
      href: 'https://rs.school/courses/javascript-mentoring-program',
      target: '_blank',
    });
    logo.setHTML(`<img class='logo-img' src='./public/img/rs_school_js.svg'>`);

    const year = new BaseComponent({ tag: 'div', textContent: '2024' });

    super({ tag: 'footer', className: 'header card' });
    this.appendChildren([author, year, logo]);
  }
}
