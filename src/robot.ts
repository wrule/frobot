
export
interface IConfig {
  /**
   * 交易币种
   */
  symbol: string;
  /**
   * 做单倍数
   */
  lever: number;
  /**
   * 开仓方向
   */
  direction: number;
  /**
   * 首单额度
   */
  first_amount: number;
  /**
   * 做单数量
   */
  order_number: number;
  /**
   * 止盈比例
   */
  pstop_ratio: number;
  /**
   * 止盈回调
   */
  pstop_pullback_ratio: number;
  /**
   * 补仓跌幅
   */
  fix_drop_ratios: number[];
  /**
   * 补仓回调
   */
  fix_pullback_ratio: number;
  /**
   * 补仓模式
   */
  fix_mode: string;
  /**
   * 检测K线
   */
  timeframe: string;
  /**
   * 趋势做单
   */
  trend_time: string;
}

export
class Robot {
  public constructor(private readonly config: IConfig) { }

  /**
   * 开启机器人
   */
  public Start() {

  }

  /**
   * 停止机器人
   */
  public Stop() {

  }
}
