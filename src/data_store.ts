import { KLineWatcher } from './kline_watcher';
import { TickerWatcher } from './ticker_watcher';
export
class DataStore {
  private tickerStore = new Map<string, TickerWatcher>();
  private klineStore = new Map<string, KLineWatcher>();

  public Start() {
    Array.from(this.tickerStore.values()).forEach((watcher) => {
      watcher.Start();
    });
  }

  public Stop() {
    Array.from(this.tickerStore.values()).forEach((watcher) => {
      watcher.Stop();
    });
    Array.from(this.klineStore.values()).forEach((watcher) => {
      watcher.Stop();
    });
  }

  public Subscribe() {

  }

  public Unsubscribe() {

  }
}
