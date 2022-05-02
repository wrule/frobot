import ccxt from 'ccxt';
// @ts-ignore
import Secret from '../.secret.json';

// console.log('你好，世界', Secret.API_KEY);
console.log(ccxt.exchanges);
const a = new ccxt.binance({
  apiKey: Secret.API_KEY,
  secret: Secret.SECRET_KEY,
});
console.log(a);
