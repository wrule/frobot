import uuid from 'uuid';

export
class ServerTime {
  public constructor() { }

  private time = -1;
  private subscriber = new Map<string, (time: number, old_time: number) => void>();

  public Update(time: number) {
    if (time !== this.time) {
      Array.from(this.subscriber.values()).forEach((callback) => {
        callback(time, this.time);
      });
      this.time = time;
    }
  }

  public Subscribe(
    callback: (time: number, old_time: number) => void,
    name?: string,
  ) {
    const result = name || uuid.v4();
    this.subscriber.set(result, callback);
    return result;
  }

  public UnSubscribe(name: string) {
    this.subscriber.delete(name);
  }

  public get Subscriber() {
    return this.subscriber;
  }

  public get SubscriberNames() {
    return Array.from(this.subscriber.keys());
  }
}
