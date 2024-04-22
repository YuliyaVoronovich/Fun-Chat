import { BaseComponent } from '../base-component';

interface ILink {
  className: string;
  textContent?: string;
  href: string;
  target?: string;
  onClick?: () => void;
}

export class Link extends BaseComponent<HTMLLinkElement> {
  constructor({ className, href, textContent, target, onClick }: ILink) {
    super({ tag: 'a', className, textContent, href });
    if (target) {
      this.node.target = target;
    }
    if (onClick) {
      this.addListener('click', () => onClick());
    }
  }
}
