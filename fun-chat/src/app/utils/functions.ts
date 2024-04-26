import type { IUser } from '../interfaces.ts/sockets';

export function isUser(value: unknown): value is IUser {
  return Boolean(value) && typeof value === 'object';
}

export function setDate(datetime: number) {
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
}
