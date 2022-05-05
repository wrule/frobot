import ccxt, { Ticker } from 'ccxt';
import fs from 'fs';

export
class TickerWatcher {
  public constructor(
    private readonly exchange: ccxt.binance,
    private readonly symbol: string,
    private readonly callback?: (ticker: Ticker) => void,
    private readonly interval: number = 5000,
  ) { }

  private timer: any = -1;

  private async loopQuery() {
    clearTimeout(this.timer);
    try {
      const result = await this.exchange.fetchTicker(this.symbol);
      if (this.callback) {
        this.callback(result);
      } else {
        console.log(result.datetime, result.close);
      }
    } catch (e) {
      console.error(e);
      fs.appendFileSync(`err.csv`, `${Number(new Date())}\n${e}\n`);
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
