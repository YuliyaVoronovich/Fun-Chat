import { BaseComponent } from '../base-component';

interface ILink {
  className: string;
  textContent: string;
  href: string;
  onClickt?: () => void;
}

export class Link extends BaseComponent<HTMLLinkElement> {
  constructor({ className, textContent, href }: ILink) {
    super({ tag: 'a', className, textContent, href });
  }
}
