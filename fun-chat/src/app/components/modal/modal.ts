import { BaseComponent } from '../base-component';
import { Button } from '../button/button';
import './modal.scss';

export class Modal extends BaseComponent {
  private modalWrapper = new BaseComponent({ tag: 'div', className: 'modal-content' });

  private modal = new BaseComponent({ tag: 'div', className: 'alert alert-dismissible show' });

  private btnClose: Button;

  constructor() {
    super({ tag: 'div', className: 'modal-wrapper' });

    this.modal.setAttribute('role', 'alert');
    this.btnClose = new Button({ className: 'btn-close', type: 'button', onClick: this.closeModal });
    this.btnClose.setAttribute('aria-label', 'Close');

    this.modalWrapper.appendChildren([this.modal]);
    this.appendChildren([this.modalWrapper]);
  }

  public alertMess = (message: string, type: string) => {
    this.addClass('show');
    this.modal.removeClass('fade');
    this.modal.addClass(`alert-${type}`);
    this.modal.setHTML(`<div>${message}</div>`);
    this.modal.appendChildren([this.btnClose]);
  };

  public closeModal = () => {
    this.modal.addClass('fade');
    this.removeClass('show');
  };
}
