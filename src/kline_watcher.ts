
import ccxt, { Ticker } from 'ccxt';
import fs from 'fs';
import moment from 'moment';
import { ETimeFrame, TimeFrame } from './timeframe';

export
class KLineWatcher {
  public constructor(
    private readonly exchange: ccxt.binance,
    private readonly symbol: string,
    private readonly timeframe: ETimeFrame,
    private readonly callback?: (klines: any[]) => void,
    private readonly interval = 1000,
  ) { }

  private timer: any = -1;
  private since?: number = undefined;

  private async loopQuery() {
    clearTimeout(this.timer);
    try {
      const result = await this.exchange.fetchOHLCV(
        this.symbol,
        TimeFrame(this.timeframe),
        this.since,
        1000,
      );
      if (this.callback) {
        this.callback(result);
      } else {
        console.log(result.length);
      }
    } catch (e) {
      console.log(e);
    } finally {
      this.timer = setTimeout(() => {
        this.loopQuery();
      }, this.interval);
    }
  }

  public Start() {
    this.loopQuery();
  }

  public Stop() {
    clearTimeout(this.timer);
  }
}
