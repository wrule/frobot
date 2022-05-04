import ccxt from 'ccxt';
// @ts-ignore
import Secret from '../.secret.json';
import moment from 'moment';
import fs from 'fs';
import { Ticker } from './ticker';

async function main() {
  const binance = new ccxt.binance({
    // apiKey: Secret.API_KEY,
    // secret: Secret.SECRET_KEY,
    enableRateLimit: true,
    options: {
      defaultType: 'future',
    },
  });
  // await binance.loadMarkets();
  // for (let key in binance.markets) {
  //   if (key.includes('BTC')) {
  //     console.log(key);
  //   }
  // }
  // const ticker = await binance.fetchTicker('BTC/USDT');
  // setInterval(() => {
  //   console.log(ticker.close);
  // }, 1000);
  // const result = await binance.fetchOHLCV('BTC/USDT', '1h', 1651550400000, 24);
  // console.log(result);

  async function loop_ticker() {
    // const list = await binance.fetchOHLCV('BTC/USDT', '15m', 1651640400000, 5);
    // console.log(list);

    // return;
    try {
      const ticker = await binance.fetchTicker('BTC/USDT');
      console.log(
        moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        ticker.close,
        ticker.last,
        moment(new Date(ticker.datetime)).format('YYYY-MM-DD HH:mm:ss'),
        moment(new Date(ticker.timestamp)).format('YYYY-MM-DD HH:mm:ss'),
      );
      fs.appendFileSync('log.csv', `${
        moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      },${
        ticker.close
      },${
        ticker.last
      },${
        moment(new Date(ticker.datetime)).format('YYYY-MM-DD HH:mm:ss')
      },${
        moment(new Date(ticker.timestamp)).format('YYYY-MM-DD HH:mm:ss')
      }\n`);
    } catch (e: any) {
      fs.appendFileSync('log.csv', `${e.message}\n`);
    } finally {
      setTimeout(() => {
        loop_ticker();
      }, 1000);
    }
  }

  // loop_ticker();

  const list: any[] = [];

  async function kline(symbol: string, timeframe: string, since?: number) {
    const result = await binance.fetchOHLCV(
      symbol,
      timeframe,
      since,
      1000,
    );
    if (list.length > 0) {
      result.forEach((item, index) => {
        if (index > 0) {
          list.push(item);
        } else {
          list[list.length - 1] = item;
        }
      });
    } else {
      list.push(...result);
    }
    console.log(list.length);
    setTimeout(() => {
      let next_time = undefined;
      if (list.length > 0) {
        next_time = list[list.length - 1][0];
      }
      kline(symbol, timeframe, next_time);
    }, 1000);
  }

  // kline('BTC/USDT', '1m');

  const tk = new Ticker(binance, 'BTC/USDT');
  tk.Start();
}

main();
