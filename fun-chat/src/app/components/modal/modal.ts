import { BaseComponent } from '../base-component';
import { Button } from '../button/button';
import './modal.scss';

export class Modal extends BaseComponent {
  private modalWrapper = new BaseComponent({ tag: 'div', className: 'modal-wrapper' });

  private modal = new BaseComponent({ tag: 'div', className: 'alert alert-dismissible show' });

  private btnClose: Button;

  constructor() {
    super({ tag: 'div' });

    this.modal.setAttribute('role', 'alert');
    this.btnClose = new Button({ className: 'btn-close', type: 'button', onClick: this.closeModal });
    this.btnClose.setAttribute('aria-label', 'Close');

    this.modalWrapper.appendChildren([this.modal]);
    this.appendChildren([this.modalWrapper]);
  }

  public alertMess = (message: string, type: string) => {
    console.log(message);
    this.modal.addClass(`alert-${type}`);
    this.modal.setHTML(`<div>${message}</div>`);
    this.modal.appendChildren([this.btnClose]);
  };

  private closeModal = () => {
    this.modal.addClass('fade');
    this.modal.removeClass('show');
  };
}
