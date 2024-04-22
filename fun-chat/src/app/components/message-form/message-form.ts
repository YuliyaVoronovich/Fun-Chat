import { BaseComponent } from '../base-component';
import { Button } from '../button/button';
import { Input } from '../input/input';
import './message-form.scss';

export class MessageForm extends BaseComponent<HTMLFormElement> {
  private inputMessage: Input;

  private isEdit = false;

  private idMsg = '';

  private btnMessage: Button;

  constructor(private onSubmit?: (idMsg: string, text: string, isEdit: boolean) => void) {
    super({ tag: 'form', className: 'message-form' });
    this.node.action = '';
    this.inputMessage = new Input({
      type: 'text',
      className: 'form-control message-form-input',
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
      this.onSubmit?.(this.idMsg, text, this.isEdit);
    });
  }

  public set editForm(value: boolean) {
    this.isEdit = value;
  }

  public set IdMsg(value: string) {
    this.idMsg = value;
  }

  public changeInputStatus = () => {
    this.inputMessage.removeAttribute('disabled');
  };

  public resetInputMessage = () => {
    this.inputMessage.setValue('');
  };

  public changeStatusBtn = (value: string) => {
    this.btnMessage.toggleClass('disabled', Boolean(!value.trim()));
  };

  public setValueTextMsg = (value: string) => {
    this.inputMessage.setValue(value);
  };

  public setInputColor = () => {
    this.inputMessage.addClass('edit');
  };

  public removeInputColor = () => {
    this.inputMessage.removeClass('edit');
  };
}
