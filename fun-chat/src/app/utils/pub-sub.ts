import type { EventPayloads, EventType } from '../interfaces.ts/sockets';

type SubscriberFn<T extends EventType> = (payload: EventPayloads[T]) => void;

export class PubSub<T extends EventType> {
  private subscribers: Record<T, SubscriberFn<T>[]> = {} as Record<T, SubscriberFn<T>[]>;

  public subscribe<K extends T>(eventType: K, subscriber: SubscriberFn<K>): void {
    if (!this.subscribers[eventType]) {
      this.subscribers[eventType] = [];
    }
    this.subscribers[eventType].push(subscriber as SubscriberFn<T>);
  }

  public unsubscribe<K extends T>(eventType: K, subscriber: SubscriberFn<K>): void {
    const subscribers = this.subscribers[eventType];
    if (!subscribers) {
      return;
    }

    const index = subscribers.indexOf(subscriber as SubscriberFn<T>);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  }

  public publish(eventType: T, payload: EventPayloads[T]): void {
    const subscribers = this.subscribers[eventType] || [];
    subscribers.forEach((subscriber) => subscriber(payload));
  }
}
