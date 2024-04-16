import { BaseComponent } from '../base-component';

interface ILink {
  className: string;
  textContent?: string;
  href: string;
  target?: string;
  onClickt?: () => void;
}

export class Link extends BaseComponent<HTMLLinkElement> {
  constructor({ className, href, textContent, target }: ILink) {
    super({ tag: 'a', className, textContent, href, target });
  }
}
