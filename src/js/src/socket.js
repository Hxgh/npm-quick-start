import Socket from 'jsonrpc2websocket';
import { createGUID } from './tools';

/**
 * 过滤handleStream需要的参数
 *
 * @memberof CCESocket
 */
const objectFilterKey = (keys, obj) => {
  return Object.assign(
    {},
    ...Object.entries(obj)
      .filter((i) => i[1] !== undefined && keys.find((ii) => ii === i[0]))
      .map((iii) => {
        return { [iii[0]]: iii[1] };
      })
  );
};

export default class CCESocket {
  cloud = null;
  edge = null;
  connectState = {};
  props = {};

  constructor(props) {
    this.connectState = {};
    this.props = props;
    this.initCloud();
  }

  /**
   * 初始化cloud云端
   *
   */
  initCloud() {
    const { url, protocols } = this.props;
    const { callback } = this.connectState;
    if (this.cloud) this.cloud.close();
    this.cloud = new Socket({
      url,
      protocols: protocols || createGUID(),
      onerror: (e) =>
        callback && callback({ lifecycle: 'cloud onerror', result: e }),
    });
  }

  /**
   * 初始edge边缘端
   *
   * @param {*} e
   */
  initEdge(start) {
    const url = this.connectState.res.dataEndpoint;
    const { callback } = this.connectState;
    if (!url || !callback) return;
    if (this.edge) this.edge.close();
    this.edge = new Socket({
      url,
      onmessage: (res) => {
        if (
          res &&
          res.result &&
          res.id !== undefined &&
          res.id === this.connectState.jsonrpcID
        ) {
          callback({ lifecycle: 'edge', ...res.result });
        }
      },
      onerror: (e) => callback({ lifecycle: 'edge onerror', result: e }),
      onopen: () => start(),
    });
  }

  /**
   * 开始流模式 || 停止流模式
   *
   * @param {*} data
   */
  handleStream(data) {
    const { params, method, lifecycle } = data;
    const { callback } = this.connectState;
    if (!params || !method) {
      window.console.error('CCESocket handleStream 传参无效');
      return;
    }
    this.cloud.send({
      method,
      params: [params],
      callback: (res) => callback({ lifecycle, ...res }),
    });
  }

  /**
   * 开始订阅
   *
   * @memberof CCESocket
   */
  start() {
    const { keys } = this.connectState;
    if (!keys) return;
    const { start } = keys;
    if (!start) return;
    const params = this.connectState.filter;
    this.handleStream({
      method: start,
      params,
      lifecycle: start,
    });
  }

  /**
   * 设置参数setParameters
   *
   * @memberof CCESocket
   */
  setParameters(p) {
    const { keys } = this.connectState;
    if (!keys) return;
    const { setParameters, setParametersKeys } = keys;
    if (!setParameters) return;
    const params = objectFilterKey(setParametersKeys, {
      ...this.connectState.filter,
      ...p,
    });
    this.handleStream({
      method: setParameters,
      params,
      lifecycle: setParameters,
    });
  }

  /**
   * 关闭订阅
   *
   * @memberof CCESocket
   */
  stop() {
    const { keys } = this.connectState;
    if (!keys) return;
    const { stop } = keys;
    if (!stop) return;
    const params = this.connectState.filter;
    this.handleStream({
      method: stop,
      params,
      lifecycle: stop,
    });
  }

  /**
   * 销毁CCESocket
   *
   * @memberof CCESocket
   */
  close() {
    if (this.connectState) this.stop();
    if (this.cloud) this.cloud.close();
    if (this.edge) this.edge.close();
    const { callback } = this.connectState;
    if (callback) callback({ lifecycle: 'close' });
  }

  /**
   * 启动流模式
   *
   * @callback {*} 返回值会携带key为lifecycle的生命周期标识：连接边缘端为edge，其它为所设置的method名
   * @returns void
   */
  connect(data) {
    // 设置默认值
    const defaultData = {
      keys: {
        start: 'start', // start的method
        stop: 'stop', // stop的method
        preset: 'preset', // preset的method
        params: ['taskId', 'edgeID'], // start、stop时从connect回调中+参数中所需要取的key的数组
        setParameters: 'setParameters', // setParameters的method
        setParametersKeys: ['taskId', 'edgeID', 'parameters'], // setParameters时从connect回调中+参数中所需要取的key的数组
      },
      jsonrpcID: 0,
    };
    const { params, keys, jsonrpcID, callback, parameters } = {
      ...defaultData,
      ...data,
    };
    // 启动
    if (!this.cloud || !callback) return;
    this.cloud.send({
      method: keys.preset,
      params: [params],
      callback: (res) => {
        // 判断是否error
        if (!res || !res.result) {
          callback({ lifecycle: keys.preset, ...res });
          return;
        }
        // 过滤handleStream参数:从云端获取数据与key匹配
        const filter = objectFilterKey(keys.params, { ...params, ...res });
        // 存储此连接状态
        this.connectState = {
          params,
          keys,
          callback,
          jsonrpcID,
          res,
          filter,
        };
        // 连接边缘端
        this.initEdge(() => {
          // 如果传入初始化参数 则先设置参数
          if (parameters) this.setParameters(parameters);
          // 发送start指令
          this.start();
        });
      },
    });
  }
}
