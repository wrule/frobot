
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

  private async loopQuery() {
  }

  public Start() {
    this.loopQuery();
  }

  public Stop() {
    clearTimeout(this.timer);
  }
}
