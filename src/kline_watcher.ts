
import ccxt, { Ticker } from 'ccxt';
import fs from 'fs';
import moment from 'moment';
import { ETimeFrame } from './timeframe';

export
class KLineWatcher {
  public constructor(
    private readonly exchange: ccxt.binance,
    private readonly symbol: string,
    private readonly callback?: (klines: any[]) => void,
    private readonly interval: ETimeFrame = ETimeFrame._15m,
  ) { }

  private timer: any = -1;
  private since?: number = undefined;

  private async loopQuery() {
    clearTimeout(this.timer);
    try {
      const result = await this.exchange.fetchOHLCV(
        this.symbol,
        '1h',
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
