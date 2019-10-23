import Event from './Event';

class Canvas extends Event {
  public ca: HTMLCanvasElement;
  public ctx: any;

  public canvasInfos: {
    // canvas 占据屏幕的宽度高度
    width: number;
    height: number;
    // canvas 的左上角和屏幕最左侧和最上侧的距离
    realScreenX: number;
    realScreenY: number;
  };

  public constructor(dom: HTMLCanvasElement) {
    super();
    this.ca = dom;
    this.ctx = dom.getContext('2d');

    this.canvasInfos = {
      // canvas 的宽度和高度
      width: 0,
      height: 0,
      // canvas 左上角相对屏幕的坐标
      realScreenX: 0,
      realScreenY: 0,
    };

    this.getCanvasClientReact();
    this.initCanvasWidthHeight();
  }

  public getCanvasClientReact() {
    const { width, height, x, y } = this.ca.getBoundingClientRect() as DOMRect;
    this.canvasInfos.width = width;
    this.canvasInfos.height = height;
    this.canvasInfos.realScreenX = x;
    this.canvasInfos.realScreenY = y;
  }

  public initCanvasWidthHeight() {
    // 为什么有这一步呢，因为 canvas 的画布大小要用 width 和 height 来直接设定
    // style 里面的 width 和 height 并不是 canvas 的画布大小
    this.ca.width = this.canvasInfos.width;
    this.ca.height = this.canvasInfos.height;
  }

  public clear() {
    this.ctx.clearRect(0, 0, this.canvasInfos.width, this.canvasInfos.height);
  }

  public resize() {
    this.getCanvasClientReact();
    this.initCanvasWidthHeight();
  }
}

export default Canvas;
