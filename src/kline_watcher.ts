
import ccxt, { Ticker } from 'ccxt';
import fs from 'fs';
import moment, { Moment } from 'moment';
import { ETimeFrame, TimeFrame } from './timeframe';

export
interface KLine {
  time: Moment;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export
function ArrayToKLine(array: number[]): KLine {
  return {
    time: moment(new Date(array[0])),
    open: array[1],
    high: array[2],
    low: array[3],
    close: array[4],
    volume: array[5],
  };
}

export
class KLineWatcher {
  public constructor(
    private readonly exchange: ccxt.binance,
    private readonly symbol: string,
    private readonly timeframe: ETimeFrame,
    private readonly callback?: (hist: KLine[], cur: KLine) => void,
    private readonly interval = 1000,
  ) { }

  private timer: any = -1;
  private since?: number = undefined;
  private klines: KLine[] = [];

  private async loopQuery() {
    clearTimeout(this.timer);
    try {
      const result = await this.exchange.fetchOHLCV(
        this.symbol,
        TimeFrame(this.timeframe),
        this.since,
        1000,
      );
      if (result.length > 0) {
        if (this.klines.length > 0) {
          result.forEach((item, index) => {
            const kline = ArrayToKLine(item);
            if (index > 0) {
              this.klines.push(kline);
            } else {
              this.klines[this.klines.length - 1] = kline;
            }
          });
        } else {
          this.klines = result.map((item) => ArrayToKLine(item));
        }
        this.since = result[result.length - 1][0];
        const hist = this.klines.slice(0, this.klines.length - 1);
        const cur = this.klines[this.klines.length - 1];
        if (this.callback) {
          this.callback(hist, cur);
        } else {
          console.log(hist.length, cur.close);
        }
      }
    } catch (e) {
      console.error(e);
      fs.appendFileSync(
        `err-kl.log`,
        `[${
          moment().format('YYYY-MM-DD HH:mm:ss:SSS')
        }][${
          this.symbol
        }-${
          TimeFrame(this.timeframe)
        }-${
          this.interval
        }]:\n${e}\n`);
    } finally {
      this.timer = setTimeout(() => {
        this.loopQuery();
      }, this.interval);
    }
  }

  public Start() {
    this.since = undefined;
    this.klines = [];
    this.loopQuery();
  }

  public Stop() {
    clearTimeout(this.timer);
  }
}
