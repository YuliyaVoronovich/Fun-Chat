import { sessionStorageInst } from '../../../services/session-service';
import { BaseComponent } from '../../../components/base-component';
import './message.scss';

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
  onContext: (el: Message, id: string, author: string) => void;
  onClick: () => void;
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

  private container = new BaseComponent({ tag: 'div', className: `msg-container card` });

  constructor({ id, text, from, datetime, status, onContext, onClick }: IMessage) {
    console.log(status);
    const nameClass = sessionStorageInst.getUser('user')?.login === from ? 'name-from' : 'name-to';
    super({ tag: 'div', className: `msg-wrapper ${nameClass}` });
    this.setAttribute('id', `${id}`);
    this.currentTextMsg = text;
    this.currentSender = from;

    const header = new BaseComponent({ tag: 'div', className: 'msg-container-header' });

    this.textMsg = new BaseComponent({ tag: 'div', className: 'msg-text', textContent: `${this.currentTextMsg}` });
    const dataMsg = new BaseComponent({ tag: 'div', className: 'msg-date', textContent: `${this.setDate(datetime)}` });

    const statusMsg = sessionStorageInst.getUser('user')?.login === from ? this.getStatus(status) : '';
    this.statusMsg = new BaseComponent({ tag: 'div', className: 'msg-status', textContent: `${statusMsg}` });
    const name = sessionStorageInst.getUser('user')?.login === from ? 'You' : from;

    const nameMsg = new BaseComponent({ tag: 'div', className: `msg-name ${nameClass}`, textContent: `${name}` });
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

  private setDate = (datetime: number) => {
    const ownerTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const date = new Date(datetime);

    const dateTimeFormatter = new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: ownerTimeZone,
    });
    return dateTimeFormatter.format(date);
  };

  public get text() {
    return this.currentTextMsg;
  }

  public get sender() {
    return this.currentSender;
  }

  public updateText = (text: string) => {
    this.textMsg.destroy();
    this.textMsg = new BaseComponent({ tag: 'div', className: 'msg-text', textContent: `${text}` });
    this.currentTextMsg = text;
    this.container.appendChildren([this.textMsg]);
    this.appendChildren([this.container]);
  };

  public updateStatus = (status: IStatus) => {
    this.statusMsg.destroy();
    this.statusMsg = new BaseComponent({
      tag: 'div',
      className: 'msg-status',
      textContent: `${this.getStatus(status)}`,
    });
    this.container.appendChildren([this.statusMsg]);
    this.appendChildren([this.container]);
  };

  private getStatus = ({ isDelivered, isEdited, isReaded }: IStatus) => {
    let status = '';

    if (isEdited) {
      status = 'Edited';
    } else if (isReaded && sessionStorageInst.getUser('user')?.login === this.currentSender) {
      status = 'Readed';
    } else if (isDelivered && sessionStorageInst.getUser('user')?.login === this.currentSender) {
      status = 'Delivered';
    }

    return status;
  };
}
