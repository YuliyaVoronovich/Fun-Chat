import { BaseComponent } from '../base-component';

interface IButton {
  className: string;
  type?: 'button' | 'submit' | 'reset';
  textContent?: string;
  onClick?: () => void;
}

export class Button extends BaseComponent<HTMLButtonElement> {
  constructor({ className, type, textContent, onClick }: IButton) {
    super({
      tag: 'button',
      type,
      className,
      textContent,
    });
    if (onClick) {
      this.addListener('click', onClick);
    }
  }
}
