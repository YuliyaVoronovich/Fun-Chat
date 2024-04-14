import { BaseComponent } from '../base-component';
import { Input } from '../input/input';
import './login-form.scss';

export class LoginForm extends BaseComponent<HTMLFormElement> {
  private readonly name: Input;

  private readonly password: Input;

  private readonly submit = new Input({ type: 'submit', classNameInput: 'form-input-button', value: 'Login' });

  constructor(private onSubmit?: (name: string, password: string) => void) {
    super({ tag: 'form', className: 'login-form' });
    this.node.action = '';
    this.name = new Input({
      type: 'text',
      classNameInput: 'form-input-name',
      name: 'Name',
      placeholder: 'Input name',
    });
    this.password = new Input({
      type: 'password',
      classNameInput: 'form-input-password',
      placeholder: 'Input password',
    });
    this.appendChildren([this.name, this.password, this.submit]);

    this.submit.addListener('click', (e: Event) => {
      e.preventDefault();
      const name = this.name.getValue();
      const password = this.password.getValue();
      this.onSubmit?.(name, password);
    });
  }
}
