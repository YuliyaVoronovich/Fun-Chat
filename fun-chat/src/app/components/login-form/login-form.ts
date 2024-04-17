import { BaseComponent } from '../base-component';
import { Button } from '../button/button';
import { Input } from '../input/input';
import './login-form.scss';

const patternLogin = '^[A-Z][\\-a-zA-z]{3,}$';
const patternPassword = '^(?=.*[0-9])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}$';

export class LoginForm extends BaseComponent<HTMLFormElement> {
  private readonly login: Input;

  private messageErrorLogin = new BaseComponent({
    tag: 'span',
    className: 'invalid-feedback',
    textContent: 'Length must be more than 4 characters',
  });

  private readonly password: Input;

  private messageErrorPass = new BaseComponent({
    tag: 'span',
    className: 'invalid-feedback',
    textContent: 'Length must be more than 6 characters and contain at least 1 uppercase letter and at least 1 number',
  });

  private readonly submit = new Button({ type: 'submit', className: 'btn btn-primary', textContent: 'Login' });

  constructor(private onSubmit?: (name: string, password: string) => void) {
    super({ tag: 'form', className: 'login-form needs-validation' });
    this.node.action = '';
    this.setAttribute('novalidate', 'novalidate');
    this.login = new Input({
      type: 'text',
      className: 'form-control form-input-name',
      name: 'Name',
      placeholder: 'Input name',
    });
    this.login.setAttribute('required', 'required');
    this.login.setAttribute('pattern', patternLogin);
    this.password = new Input({
      type: 'password',
      className: 'form-control form-input-password',
      placeholder: 'Input password',
    });
    this.password.setAttribute('required', 'required');
    this.password.setAttribute('pattern', patternPassword);
    this.appendChildren([this.login, this.messageErrorLogin, this.password, this.messageErrorPass, this.submit]);

    this.addListener('submit', (e: Event) => {
      this.addClass('was-validated');
      e.preventDefault();
      e.stopPropagation();
      if (this.checkValidity()) {
        const login = this.login.getValue();
        const password = this.password.getValue();
        this.onSubmit?.(login, password);
      }
    });
  }

  private checkValidity() {
    return (
      new RegExp(patternLogin).test(this.login.getValue()) && new RegExp(patternPassword).test(this.password.getValue())
    );
  }
}
