import type { IUser } from '../interfaces.ts/sockets';
import { isUser } from '../utils/functions';

export class StorageService {
  constructor(private storage: Storage) {}

  public setItem(key: string, value: unknown) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  private getItem(key: string): unknown {
    const data: string | null = this.storage.getItem(key);

    if (data !== null) {
      return JSON.parse(data);
    }

    return null;
  }

  public getUser(key: string): IUser | null {
    const user = this.getItem(key);

    if (!user) {
      return null;
    }

    if (isUser(user)) {
      return user;
    }

    throw new Error('unknown value stored with key user');
  }

  public checkUser(key: string): boolean {
    return !!this.storage.getItem(`${key}`);
  }

  public deleteData(key: string): void {
    this.storage.removeItem(key);
  }
}
export const sessionStorageService = new StorageService(window.sessionStorage);
