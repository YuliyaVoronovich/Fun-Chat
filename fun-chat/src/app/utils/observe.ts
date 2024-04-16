// Define the event type
type EventType = 'userLoggedIn' | 'userLoggedOut' | 'messageReceived';

// Define the payload types for each event
type EventPayloads = {
  userLoggedIn: { userId: string; timestamp: number };
  userLoggedOut: { userId: string; timestamp: number };
  messageReceived: { message: string; sender: string; timestamp: number };
};

// Define the subscriber function type
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

// Example usage
const pubSub = new PubSub();

pubSub.subscribe('userLoggedIn', (payload) => {
  console.log(`User ${payload.userId} logged in at ${payload.timestamp}`);
});

pubSub.subscribe('messageReceived', (payload) => {
  console.log(`Message "${payload.message}" received from ${payload.sender} at ${payload.timestamp}`);
});

// Simulate events being published
pubSub.publish('userLoggedIn', { userId: '123', timestamp: Date.now() });
pubSub.publish('messageReceived', { message: 'Hello!', sender: 'Alice', timestamp: Date.now() });
