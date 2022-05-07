
import ccxt, { Ticker } from 'ccxt';
import { KLineWatcher } from './kline_watcher';
import { TickerWatcher } from './ticker_watcher';
import { ETimeFrame } from './timeframe';

export
class DataWorker {
  public constructor(
    private readonly exchange: ccxt.binance,
    private readonly symbol: string,
    private readonly timeframe: ETimeFrame,
  ) {
    this.tickerWatcher = new TickerWatcher(
      this.exchange,
      this.symbol,
      (ticker) => {
        const remainder = ticker.timestamp % Number(this.timeframe);
        if (remainder > 10 * 1000) {
          console.log('停止');
        }
        console.log('tk', ticker.timestamp, ticker.close);
      },
      1000,
    );
    this.klineWatcher = new KLineWatcher(
      this.exchange,
      this.symbol,
      this.timeframe,
      undefined,
      1000,
    );
  }

  private tickerWatcher!: TickerWatcher;
  private klineWatcher!: KLineWatcher;

  public Start() {
    this.tickerWatcher.Start();
  }

  public Stop() {
    this.tickerWatcher.Stop();
    this.klineWatcher.Stop();
  }
}

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
