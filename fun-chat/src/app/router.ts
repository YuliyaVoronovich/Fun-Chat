import type { BaseComponent } from './components/base-component';
import type Page from './pages/page';
import { sessionStorageService } from './services/session-service';

const mapRoutes = {
  '': () => import('./pages/login-page/login-page').then((item) => item.LoginPage),
  login: () => import('./pages/login-page/login-page').then((item) => item.LoginPage),
  chat: () => import('./pages/chat-page/chat-page2').then((item) => item.ChatPage2),
  about: () => import('./pages/about-page/about-page').then((item) => item.AboutPage),
};

type Route = keyof typeof mapRoutes;

function isValidRoute(route: string): route is Route {
  return Object.keys(mapRoutes).includes(route);
}

export class Router {
  private location: keyof typeof mapRoutes = '';

  constructor(private routerOutlet: Page) {
    window.addEventListener('hashchange', this.handleLocationChange.bind(this));
    this.handleLocationChange();
  }

  public handleLocationChange(): void {
    const isUser: boolean = sessionStorageService.checkUser('user');
    const pathname = window.location.hash.slice(1) as keyof typeof mapRoutes;

    if (!isUser && pathname !== 'about') {
      this.location = 'login';
    } else if (!pathname || pathname === 'login') {
      this.location = 'chat';
    } else {
      this.location = pathname;
    }
    window.location.hash = this.location;

    if (!isValidRoute(this.location)) {
      return;
    }
    // TODO Check Autorization login

    this.setViewContent()
      .then((data) => {
        this.routerOutlet.setContent(data);
      })
      .catch((error: Error) => {
        throw new Error(error.message);
      });
  }

  private setViewContent = async (): Promise<BaseComponent> => {
    const Page = await mapRoutes[this.location]();
    return new Page();
  };
}
