import type { User } from '../interfaces.ts/sockets';

class SessionStorage {
  public setItem(key: string, value: unknown): void {
    sessionStorage.setItem(`${key}`, JSON.stringify(value));
  }

  private static getItem(key: string): unknown {
    const data: string | null = localStorage.getItem(key);

    if (data !== null) {
      return JSON.parse(data);
    }

    return null;
  }

  public getUser(key: string): User | null {
    const user = sessionStorage.getItem(`${key}`);

    if (!user) {
      return null;
    }

    if (SessionStorage.isUser(user)) {
      return user;
    }

    throw new Error('unknown value stored with key user');
  }

  public checkUser(key: string): boolean {
    return !!sessionStorage.getItem(`${key}`);
  }

  private static isUser(value: unknown): value is User {
    return Boolean(value) && typeof value === 'object';
  }

  public deleteData(key: string): void {
    localStorage.removeItem(`${key}`);
  }
}
export const sessionStorageInst = new SessionStorage();
