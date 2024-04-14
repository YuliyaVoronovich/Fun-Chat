import Controller from './controller';

class App {
  constructor(
    private root: HTMLElement,
    private controller: Controller = new Controller(),
  ) {}

  public start(): void {
    this.root.append(this.controller.getNode());
  }
}
const app: App = new App(document.body);
app.start();
