import type { BaseComponent } from './components/base-component';
import type Page from './pages/page';
import { sessionStorageInst } from './services/session-service';

const mapRoutes = {
  '': () => import('./pages/login-page/login-page').then((item) => item.LoginPage),
  login: () => import('./pages/login-page/login-page').then((item) => item.LoginPage),
  chat: () => import('./pages/chat-page/chat-page').then((item) => item.ChatPage),
  about: () => import('./pages/about-page/about-page').then((item) => item.AboutPage),
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
    const isUser: boolean = sessionStorageInst.checkUser('user');
    const pathname = window.location.hash.slice(1);

    let currentPath;
    if (!isUser && pathname !== 'about') {
      currentPath = 'login';
    } else if (!pathname || pathname === 'login') {
      currentPath = 'chat';
    } else {
      currentPath = `${pathname}`;
    }
    window.location.hash = currentPath;

    if (!isValidRoute(currentPath)) {
      return;
    }
    // TODO Check Autorization login

    this.setViewContent(currentPath)
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
