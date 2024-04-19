import { sessionStorageInst } from '../../services/session-service';
import { BaseComponent } from '../base-component';
import './message.scss';

interface IMessage {
  text: string;
  from: string;
  to?: string;
  datetime: number;
  status: {
    isDelivered: boolean;
    isEdited: boolean;
    isReaded: boolean;
  };
}

export class Message extends BaseComponent {
  constructor({ text, from, datetime, status }: IMessage) {
    const nameClass = sessionStorageInst.getUser('user')?.login === from ? 'name-from' : 'name-to';
    super({ tag: 'div', className: `msg-wrapper ${nameClass}` });

    const container = new BaseComponent({ tag: 'div', className: `msg-container card` });
    const header = new BaseComponent({ tag: 'div', className: 'msg-container-header' });

    const textMsg = new BaseComponent({ tag: 'div', className: 'msg-text', textContent: `${text}` });
    const dataMsg = new BaseComponent({ tag: 'div', className: 'msg-date', textContent: `${this.setDate(datetime)}` });

    const statusRead = sessionStorageInst.getUser('user')?.login === from && status.isDelivered ? 'Delivered' : '';
    const statusMsg = new BaseComponent({ tag: 'div', className: 'msg-status', textContent: `${statusRead}` });
    const name = sessionStorageInst.getUser('user')?.login === from ? 'You' : from;

    const nameMsg = new BaseComponent({ tag: 'div', className: `msg-name ${nameClass}`, textContent: `${name}` });
    header.appendChildren([nameMsg, dataMsg]);
    container.appendChildren([header, textMsg, statusMsg]);
    this.appendChildren([container]);
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
}
