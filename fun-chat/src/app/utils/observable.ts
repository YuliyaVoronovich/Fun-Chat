type Observer<T> = (data: T) => void;

export class ObserverWithFilter<T> {
  private observers: Array<{ observer: Observer<T>; filter?: (data: T) => boolean }> = [];

  public subscribe(observer: Observer<T>, filter?: (data: T) => boolean) {
    this.observers.push({ observer, filter });
  }

  public unsubscribe(observer: Observer<T>) {
    const observerIndex = this.observers.findIndex((obs) => obs.observer === observer);
    if (observerIndex > -1) {
      this.observers.splice(observerIndex, 1);
    }
  }

  public notify(data: T) {
    this.observers.forEach(({ observer, filter }) => {
      if (!filter || filter(data)) {
        observer(data);
      }
    });
  }
}
