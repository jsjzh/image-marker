import Event from './Event';

class Canvas extends Event {
  /**
   * 当前画布，类型是 HTMLCanvasElement
   * @memberof Canvas
   */
  public ca: HTMLCanvasElement;
  /**
   *
   * @memberof Canvas
   */
  public ctx: CanvasRenderingContext2D;
  /**
   * @member width canvas 的宽度
   * @member height canvas 的高度
   * @member realScreenX canvas 相对屏幕左上角的 x 坐标
   * @member realScreenY canvas 相对屏幕左上角的 y 坐标
   * @memberof Canvas
   */
  public canvasInfos: Canvas.ICanvasInfos;

  public constructor(dom: HTMLCanvasElement) {
    super();
    this.ca = dom;
    this.ctx = dom.getContext('2d') as CanvasRenderingContext2D;

    this.canvasInfos = {
      width: 0,
      height: 0,
      realScreenX: 0,
      realScreenY: 0,
    };

    this._getCanvasClientReact();
    this._initCanvasWidthHeight();
  }

  /**
   * 清除 canvas 绘制的所有内容
   * @memberof Canvas
   */
  public clear() {
    this.ctx.clearRect(0, 0, this.canvasInfos.width, this.canvasInfos.height);
  }

  public resize() {
    this._getCanvasClientReact();
    this._initCanvasWidthHeight();
  }

  private _getCanvasClientReact() {
    const { width, height, x, y } = this.ca.getBoundingClientRect() as DOMRect;
    this.canvasInfos.width = width;
    this.canvasInfos.height = height;
    this.canvasInfos.realScreenX = x;
    this.canvasInfos.realScreenY = y;
  }

  /**
   * 为什么有这一步呢，因为 canvas 的画布大小要用 width 和 height 来直接设定
   * style 里面的 width 和 height 并不是 canvas 的画布大小
   * @private
   * @memberof Canvas
   */
  private _initCanvasWidthHeight() {
    this.ca.width = this.canvasInfos.width;
    this.ca.height = this.canvasInfos.height;
  }
}

export default Canvas;
