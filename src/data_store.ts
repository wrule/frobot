
import ccxt, { Ticker } from 'ccxt';
import { KLine, KLineWatcher, KLineCallback } from './kline_watcher';
import { TickerWatcher, TickerCallback } from './ticker_watcher';
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
class TickerStore {

}

export
class DataStore {
  private tickerWatcherMap = new Map<string, TickerWatcher>();
  private tickerCallbacksMap = new Map<string, TickerCallback[]>();
  private tickerSubkeysMap = new Map<string, string[]>();
  private klineWatcherMap = new Map<string, KLineWatcher>();
  private klineCallbacksMap = new Map<string, KLineCallback[]>();

  public Start() {
    Array.from(this.tickerWatcherMap.values()).forEach((watcher) => {
      watcher.Start();
    });
  }

  public Stop() {
    Array.from(this.tickerWatcherMap.values()).forEach((watcher) => {
      watcher.Stop();
    });
    Array.from(this.klineWatcherMap.values()).forEach((watcher) => {
      watcher.Stop();
    });
  }

  public Subscribe(
    symbol: string,
    timeframe: string,
    tickerCallback: (ticker: Ticker) => void,
    klineCallback: (hist: KLine[], cur: KLine) => void,
    name?: string,
  ) {

  }

  public Unsubscribe(name: string) {

  }
}
