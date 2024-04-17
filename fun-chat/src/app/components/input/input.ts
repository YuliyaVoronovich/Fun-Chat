import { BaseComponent } from '../base-component';

interface IInput {
  type: string;
  className: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onInput?: (input: string) => void;
}

export class Input extends BaseComponent<HTMLInputElement> {
  constructor({ type, className, name, placeholder, value, onInput }: IInput) {
    super({
      tag: 'input',
      className,
      type,
      name,
      placeholder,
    });
    if (value) {
      this.node.value = value;
    }

    if (onInput) {
      this.addListener('input', () => onInput(this.getValue()));
    }
  }

  public getValue(): string {
    return this.node.value;
  }

  public setValue(value: string): void {
    this.node.value = value;
  }
}
