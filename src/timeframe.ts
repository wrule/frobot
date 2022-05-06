
export
enum ETimeFrame {
  _1m = (60 * 1000),
  _3m = 3 * (60 * 1000),
  _5m = 5 * (60 * 1000),
  _15m = 15 * (60 * 1000),
  _30m = 30 * (60 * 1000),
  _1h = (3600 * 1000),
  _2h = 2 * (3600 * 1000),
  _4h = 4 * (3600 * 1000),
  _6h = 6 * (3600 * 1000),
  _8h = 8 * (3600 * 1000),
  _12h = 12 * (3600 * 1000),
  _1d = 24 * (3600 * 1000),
}

export
function TimeFrame(timeframe: ETimeFrame) {
  return ETimeFrame[timeframe].replace('_', '');
}
