import type { BaseComponent } from './components/base-component';
import type Page from './pages/page';

const mapRoutes = {
  '': () => import('./pages/login-page/login-page').then((item) => item.LoginPage),
  login: () => import('./pages/login-page/login-page').then((item) => item.LoginPage),
  // chat: () => import('./pages/chat-page/chat-page').then((item) => item.ChatPage),
  // about: () => import('./pages/about-page/about-page').then((item) => item.AboutPage),
};

type Route = keyof typeof mapRoutes;

function isValidRoute(route: string): route is Route {
  return Object.keys(mapRoutes).includes(route);
}

export default class Router {
  constructor(private routerOutlet: Page) {
    window.addEventListener('hashchange', this.handleLocationChange.bind(this));
    this.handleLocationChange();
  }

  public handleLocationChange(): void {
    const pathname = window.location.hash.slice(1);

    if (!isValidRoute(pathname)) {
      return;
    }
    // TODO Check Autorization login

    this.setViewContent(pathname)
      .then((data) => {
        this.routerOutlet.setContent(data);
      })
      .catch((error: Error) => {
        throw new Error(error.message);
      });
  }

  private setViewContent = async (location: keyof typeof mapRoutes): Promise<BaseComponent> => {
    const Page = await mapRoutes[location]();
    return new Page();
  };
}
