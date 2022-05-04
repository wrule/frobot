import ccxt from 'ccxt';

export
class Ticker {
  public constructor(
    private readonly exchange: ccxt.binance,
    private readonly symbol: string,
    private readonly interval: number = 1000,
  ) { }

  private timer: any = -1;

  private async loopQuery() {
    clearTimeout(this.timer);
    try {
      const result = await this.exchange.fetchTicker(this.symbol);
      console.log(result.close, Number(new Date(result.datetime)));
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
