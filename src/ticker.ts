import ccxt from 'ccxt';

export
class Ticker {
  public constructor(
    private readonly exchange: ccxt.binance,
    private readonly symbol: string,
    private readonly callback?: (ticker: ccxt.Ticker) => void,
    private readonly interval: number = 1000,
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
