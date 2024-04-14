import { BaseComponent } from '../components/base-component';

export default class Page extends BaseComponent {
  private section: BaseComponent;

  constructor() {
    super({ tag: 'main', className: 'main' });
    this.section = new BaseComponent({
      tag: 'section',
      className: 'page-section',
    });
    const buttonWrapper = new BaseComponent({
      tag: 'aside',
      className: 'button-wrapper',
    });
    this.appendChildren([buttonWrapper, this.section]);
  }

  public setContent(section: BaseComponent): void {
    this.section.setHTML('');
    this.section.append(section);
  }
}
