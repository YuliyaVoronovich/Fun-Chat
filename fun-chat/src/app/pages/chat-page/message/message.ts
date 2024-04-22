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

export class Message extends BaseComponent {
  private statusMsg: BaseComponent;

  private textMsg: BaseComponent;

  private currentTextMsg: string;

  private container = new BaseComponent({ tag: 'div', className: `msg-container card` });

  constructor({ id, text, from, datetime, status, onContext, onClick }: IMessage) {
    const nameClass = sessionStorageInst.getUser('user')?.login === from ? 'name-from' : 'name-to';
    super({ tag: 'div', className: `msg-wrapper ${nameClass}` });
    this.setAttribute('id', `${id}`);
    this.currentTextMsg = text;

    const header = new BaseComponent({ tag: 'div', className: 'msg-container-header' });

    this.textMsg = new BaseComponent({ tag: 'div', className: 'msg-text', textContent: `${this.currentTextMsg}` });
    const dataMsg = new BaseComponent({ tag: 'div', className: 'msg-date', textContent: `${this.setDate(datetime)}` });

    const statusDelivered = sessionStorageInst.getUser('user')?.login === from && status.isDelivered ? 'Delivered' : '';
    this.statusMsg = new BaseComponent({ tag: 'div', className: 'msg-status', textContent: `${statusDelivered}` });
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

  public updateText = (text: string) => {
    this.textMsg.destroy();
    this.textMsg = new BaseComponent({ tag: 'div', className: 'msg-text', textContent: `${text}` });
    this.currentTextMsg = text;
    this.container.appendChildren([this.textMsg]);
    this.appendChildren([this.container]);
  };

  public updateStatus = (status: boolean) => {
    this.statusMsg.destroy();
    const statusDelivered = status ? 'Delivered' : '';
    this.statusMsg = new BaseComponent({ tag: 'div', className: 'msg-status', textContent: `${statusDelivered}` });
    this.container.appendChildren([this.statusMsg]);
    this.appendChildren([this.container]);
  };
}
