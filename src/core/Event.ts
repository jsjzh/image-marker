class Event {
  private _events: E.IEvnets;

  public constructor() {
    this._events = {};
  }

  /**
   * 声明事件监听
   * @param key 事件名称
   * @param func 被触发的函数
   */
  public on(key: string, func: IFn): void {
    if (Array.isArray(this._events[key])) {
      this._events[key].push(func);
    } else {
      this._events[key] = [];
      this._events[key].push(func);
    }
  }

  /**
   * 触发某一事件下所有函数
   * @param key 想要触发的事件名称
   * @param arg 被触发的函数们会传入的参数
   */
  public emit(key: string, ...arg: any[]): void {
    const args = Array.prototype.slice.call(arguments, 1);
    const context = args[args.length] === key ? null : args[args.length];

    this._events[key] &&
      this._events[key].forEach(function(func: IFn) {
        func.apply(context, args);
      });
  }

  /**
   * 删除某一事件的所有执行函数
   * @param key 事件名称
   */
  public remove(key: string): void {
    delete this._events[key];
  }

  /**
   * 删除所有的监听
   */
  public removeAll(): void {
    Object.keys(this._events).forEach(key => delete this._events[key]);
  }
}

export default Event;
