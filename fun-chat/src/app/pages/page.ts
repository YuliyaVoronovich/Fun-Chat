import { BaseComponent } from '../components/base-component';

export default class Page extends BaseComponent {
  private section: BaseComponent;

  constructor() {
    super({ tag: 'div', className: 'container-wrapper' });
    this.section = new BaseComponent({
      tag: 'section',
      className: 'page-section',
    });

    this.appendChildren([this.section]);
  }

  public setContent(section: BaseComponent): void {
    this.section.setHTML('');
    this.section.append(section);
  }
}
