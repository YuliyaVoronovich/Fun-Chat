import { sessionStorageService } from '../../../services/session-service';
import { BaseComponent } from '../../../components/base-component';
import './message.scss';
import { setDate } from '../../../utils/functions';

interface IMessage {
  id: string;
  text: string;
  from: string;
  to?: string;
  datetime: number;
  status: {
    isDelivered: boolean;
    isEdited: boolean;
    isReaded: boolean;
  };
  onContext?: (el: Message, id: string, author: string) => void;
  onClick?: () => void;
}

interface IStatus {
  isDelivered: boolean;
  isEdited: boolean;
  isReaded: boolean;
}

export class Message extends BaseComponent {
  private statusMsg: BaseComponent;

  private textMsg: BaseComponent;

  private currentTextMsg: string;

  private currentSender: string;

  public currentStatus: IStatus;

  private statusEdit = '';

  private container = new BaseComponent({ tag: 'div', className: `msg-container card` });

  constructor({ id, text, from, datetime, status, onContext, onClick }: IMessage) {
    const nameClass = sessionStorageService.getUser('user')?.login === from ? 'name-from' : 'name-to';
    super({ tag: 'div', className: `msg-wrapper ${nameClass}` });
    this.setAttribute('id', `${id}`);
    this.currentTextMsg = text;
    this.currentSender = from;
    this.currentStatus = {
      isDelivered: status.isDelivered,
      isReaded: status.isReaded,
      isEdited: status.isEdited,
    };
    const user = sessionStorageService.getUser('user')?.login;

    const header = new BaseComponent({ tag: 'div', className: 'msg-container-header' });

    this.textMsg = new BaseComponent({ tag: 'div', className: 'msg-text', textContent: this.currentTextMsg });
    const dataMsg = new BaseComponent({ tag: 'div', className: 'msg-date', textContent: setDate(datetime) });

    const statusMsg = user === from ? this.getStatus(status) : '';
    this.statusMsg = new BaseComponent({ tag: 'div', className: 'msg-status', textContent: statusMsg });
    const name = user === from ? 'You' : from;

    const nameMsg = new BaseComponent({ tag: 'div', className: `msg-name ${nameClass}`, textContent: name });
    header.appendChildren([nameMsg, dataMsg]);
    this.container.appendChildren([header, this.textMsg, this.statusMsg]);
    this.appendChildren([this.container]);

    if (onContext) {
      this.container.addListener('contextmenu', (e) => {
        e.preventDefault();
        onContext(this, id, from);
      });
    }
    if (onClick) {
      this.container.addListener('click', () => {
        onClick();
      });
    }
  }

  public get text() {
    return this.currentTextMsg;
  }

  public get sender() {
    return this.currentSender;
  }

  public updateText = (text: string) => {
    this.textMsg.destroy();
    this.textMsg = new BaseComponent({ tag: 'div', className: 'msg-text', textContent: text });
    this.currentTextMsg = text;
    this.container.appendChildren([this.textMsg]);
    this.appendChildren([this.container]);
  };

  public updateStatus = (status: IStatus) => {
    this.statusMsg.destroy();
    this.statusMsg = new BaseComponent({
      tag: 'div',
      className: 'msg-status',
      textContent: this.getStatus(status),
    });
    this.container.appendChildren([this.statusMsg]);
    this.appendChildren([this.container]);
  };

  private getStatus = ({ isDelivered, isEdited, isReaded }: IStatus) => {
    let status = '';
    const user = sessionStorageService.getUser('user')?.login;

    if (isReaded && user === this.currentSender) {
      status = 'Readed';
      this.currentStatus.isReaded = true;
    } else if (isDelivered && user === this.currentSender) {
      status = 'Delivered';
      this.currentStatus.isDelivered = true;
    }
    if (isEdited) {
      this.statusEdit = ' (Edited)';
    }
    return `${status}${this.statusEdit}`;
  };
}
