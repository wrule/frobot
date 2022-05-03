import ccxt from 'ccxt';
// @ts-ignore
import Secret from '../.secret.json';

async function main() {
  const binance = new ccxt.binance({
    apiKey: Secret.API_KEY,
    secret: Secret.SECRET_KEY,
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
  const result = await binance.fetchOHLCV('BTC/USDT', '1h', 1651550400000, 24);
  console.log(result);
}

main();
