import type { EventPayloads, EventType } from '../interfaces.ts/sockets';

type SubscriberFn<T extends EventType> = (payload: EventPayloads[T]) => void;

class PubSub<T extends EventType> {
  private subscribers: Record<T, SubscriberFn<T>[]> = {} as Record<T, SubscriberFn<T>[]>;

  public subscribe<K extends T>(eventType: K, subscriber: SubscriberFn<K>): void {
    if (!this.subscribers[eventType]) {
      this.subscribers[eventType] = [];
    }
    this.subscribers[eventType].push(subscriber as SubscriberFn<T>);
  }

  public publish(eventType: T, payload: EventPayloads[T]): void {
    const subscribers = this.subscribers[eventType] || [];
    subscribers.forEach((subscriber) => subscriber(payload));
  }
}

export const pubSub = new PubSub();
