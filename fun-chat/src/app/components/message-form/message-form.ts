import { BaseComponent } from '../base-component';
import { Button } from '../button/button';
import { Input } from '../input/input';
import './message-form.scss';

export class MessageForm extends BaseComponent<HTMLFormElement> {
  private inputMessage: Input;

  private btnMessage: Button;

  constructor(private onSubmit?: (text: string) => void) {
    super({ tag: 'form', className: 'message-form' });
    this.node.action = '';
    this.inputMessage = new Input({
      type: 'text',
      className: 'form-control',
      placeholder: 'Input yor message...',
      disabled: true,
      onInput: this.changeStatusBtn,
    });
    this.btnMessage = new Button({
      type: 'submit',
      className: 'btn btn-success disabled',
      textContent: 'Enter',
    });

    this.appendChildren([this.inputMessage, this.btnMessage]);

    this.addListener('submit', (e: Event) => {
      e.preventDefault();
      const text = this.inputMessage.getValue();
      this.onSubmit?.(text);
    });
  }

  public changeInputStatus = () => {
    this.inputMessage.removeAttribute('disabled');
  };

  public resetInputMessage = () => {
    this.inputMessage.setValue('');
  };

  private changeStatusBtn = (value: string) => {
    this.btnMessage.toggleClass('disabled', Boolean(!value));
  };
}
