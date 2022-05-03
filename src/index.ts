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
  const result = await binance.fetchMarkets();
  result.forEach((item) => {
    if (item.symbol.includes('BTC')) {
      console.log(item.symbol);
    }
  });
}

main();
