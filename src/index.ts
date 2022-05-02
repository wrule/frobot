import ccxt from 'ccxt';
// @ts-ignore
import Secret from '../.secret.json';

async function main() {
  const binance = new ccxt.binance({
    apiKey: Secret.API_KEY,
    secret: Secret.SECRET_KEY,
  });
  const a = await binance.publicGetTime();
  console.log(a);
  const ticker = await binance.fetchTicker('BTC/USDT');
  console.log(ticker.close);
}

main();
