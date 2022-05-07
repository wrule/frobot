
import ccxt, { Ticker } from 'ccxt';
import { KLine, KLineWatcher, KLineCallback } from './kline_watcher';
import { TickerWatcher, TickerCallback } from './ticker_watcher';
import { ETimeFrame } from './timeframe';
import uuid from 'uuid';

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
  public constructor(
    private readonly exchange: ccxt.binance,
  ) { }

  private tickerWatcherMap = new Map<string, TickerWatcher>();
  private tickerCallbacksMap = new Map<string, Map<string, TickerCallback>>();
  private tickerSubkeysMap = new Map<string, string[]>();
  private klineWatcherMap = new Map<string, KLineWatcher>();
  private klineCallbacksMap = new Map<string, Map<string, KLineCallback>>();

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
    const cName = name || uuid.v4();
    if (!this.tickerWatcherMap.has(symbol)) {
      this.tickerWatcherMap.set(symbol, new TickerWatcher(
        this.exchange,
        symbol,
        (ticker) => {

        },
        1000,
      ));
    }
    return cName;
  }

  public Unsubscribe(name: string) {

  }
}
