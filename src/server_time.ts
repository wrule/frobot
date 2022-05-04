
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
    name: string,
  ) {
    this.subscriber.set(name, callback);
  }

  public UnSubscribe(name: string) {
    this.subscriber.delete(name);
  }
}
