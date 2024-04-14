import { BaseComponent } from '../base-component';

interface IButton {
  className: string;
  textContent?: string;
  onClick?: () => void;
}

export class Button extends BaseComponent {
  constructor({ className, textContent, onClick }: IButton) {
    super({
      tag: 'button',
      className,
      textContent,
    });
    if (onClick) {
      this.addListener('click', onClick);
    }
  }
}
