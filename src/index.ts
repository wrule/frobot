import ccxt from 'ccxt';
// @ts-ignore
import Secret from '../.secret.json';
import moment from 'moment';
import fs from 'fs';
import { TickerWatcher } from './ticker_watcher';
import { ETimeFrame, TimeFrame } from './timeframe';
import { KLineWatcher } from './kline_watcher';
import { DataWorker } from './data_store';
import { load_csv, csv_dump_json } from '@wrule/ohlcv-utils';
import axios from 'axios';

async function main1() {
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

  let count = 0;
  const tk = new TickerWatcher(binance, 'BTC/USDT', undefined, 1000);
  // tk.Start();

  const k = new KLineWatcher(binance, 'BTC/USDT', ETimeFrame._1m);
  // k.Start();

  // console.log(ETimeFrame);

  const w = new DataWorker(binance, 'BTC/USDT', ETimeFrame._3m);
  // w.Start();

  // const a = load_csv('BTCUSDT.csv');
  // console.log(a[0]);
  csv_dump_json('BTCUSDT.csv')
}

const AuthToken = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcHAuYmlodW8zMzMucGx1c1wvYXBpXC9sb2dpbiIsImlhdCI6MTY1MTU4Nzc0MCwibmJmIjoxNjUxNTg3NzQwLCJqdGkiOiJpUzBiV2d5bVNJVmVMQ2hnIiwic3ViIjozODc3LCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3In0.odueTJaEziS_kjTytc8jNQWpZ3UZ0qKUhF3pXK3Clw8';

async function getAllLog(auth: string) {
  const result: any[] = [];
  let page = 1;
  let has_next = true;
  do {
    const rsp = await axios.get(
      'http://app.bihuo333.plus/api/tradingpairs_log', {
        params: {
          page,
          type: 0,
          tradingpairs: 'btcusdt',
          agree: '2',
          from: '1',
          id: 30512,
        },
        headers: {
          Authorization: AuthToken,
        },
      },
    );
    if (rsp.status === 200 && rsp.data.code === 200) {
      const data = rsp.data.data;
      result.push(...(data.data || []));
      has_next = data.next_page_url != null;
      page++;
    }
  } while (has_next);
  return result;
}

async function main() {
  // const list = await getAllLog(AuthToken);
  // console.log(list.length);
  // fs.writeFileSync('log.json', JSON.stringify(list, null, 2));
  const jsonText = fs.readFileSync('log.json', 'utf-8');
  const list: any[] = JSON.parse(jsonText);
  list.reverse();
  let win = 0, fail = 0;
  list.forEach((item, index) => {
    if (index > 0) {
      if (item.type === 'sell-market') {
        const prevItem = list[index - 1];
        if (prevItem.type === 'buy-market' && prevItem.bucang_cishu === '首单') {
          win++;
        } else {
          fail++;
        }
      }
    }
  });
  console.log(win, fail);
  console.log(win / (win + fail) * 100);
}

main();
