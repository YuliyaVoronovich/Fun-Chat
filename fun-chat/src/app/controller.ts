import Page from './pages/page';
import { BaseComponent } from './components/base-component';
import { Router } from './router';

export default class Controller extends BaseComponent {
  private router: Router;

  constructor() {
    const routerOutlet = new Page();
    super(
      {
        tag: 'div',
        className: 'container',
      },
      routerOutlet,
    );
    this.router = new Router(routerOutlet);
  }
}
