import Canvas from './Canvas';
import EventStore from './EventStore';
import { loadImage } from '@/shared/utils';

/**
 * @note ImageCanvas image 层几乎不做任何的监听，他的所有事件都通过 EventStore 在 draw 层触发
 * @todo 限制缩放的倍率
 * @todo 做成鼠标放置位置放大缩小的样子
 */
class ImageCanvas extends Canvas {
  public imageInfos: Image.IImageInfos;
  public scaleInfos: Image.IScaleInfos;
  public viewInfos: Image.IViewInfos;
  public mouseMoveInfos: Image.IMouseMoveInfos;

  public constructor(ref: HTMLCanvasElement) {
    super(ref);

    this.imageInfos = {
      image: new Image(),
      width: 0,
      height: 0,
      rate: 0,
    };

    this.scaleInfos = {
      scaleMax: 5,
      scaleMin: 0.2,
      scaleStep: 0.8,
    };

    this.mouseMoveInfos = {
      startX: 0,
      startY: 0,
      preX: 0,
      preY: 0,
    };

    this.viewInfos = {
      initWidth: 0,
      initHeight: 0,
      initX: 0,
      initY: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      scale: 1,
    };
  }

  /**
   * 该方法会重新初始化 image，所有关于 image 的信息会重置
   * @param url 图片地址
   */
  public async init(url: string) {
    try {
      const image: HTMLImageElement = await loadImage(url);
      this._setImageInfos(image);
      this._bindEvents();
      return this;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * 该方法和 init 的区别就是不会再次进行事件绑定
   * @param url string
   */
  public async reloadImage(url?: string) {
    if (!url) {
      this._setImageInfos(this.imageInfos.image);
    } else {
      try {
        const image: any = await loadImage(url);
        this._setImageInfos(image);
      } catch (e) {
        return Promise.reject(e);
      }
    }
  }

  public destroy() {
    EventStore.removeAll();
  }

  private _setImageInfos(image: HTMLImageElement) {
    let viewWidth: number | undefined;
    let viewHeight: number | undefined;
    let viewX: number | undefined;
    let viewY: number | undefined;

    this.imageInfos.image = image;
    this.imageInfos.width = image.width;
    this.imageInfos.height = image.height;
    this.imageInfos.rate = image.width / image.height;

    if (this.imageInfos.width >= this.imageInfos.height) {
      viewWidth = this.canvasInfos.width;
      viewHeight = viewWidth / this.imageInfos.rate;
      viewX = 0;
      viewY = (this.canvasInfos.height - viewHeight) / 2;
    } else {
      viewHeight = this.canvasInfos.height;
      viewWidth = viewHeight * this.imageInfos.rate;
      viewX = (this.canvasInfos.width - viewWidth) / 2;
      viewY = 0;
    }

    this._setViewInfos('initWidth', viewWidth);
    this._setViewInfos('initHeight', viewHeight);
    this._setViewInfos('width', viewWidth);
    this._setViewInfos('height', viewHeight);
    this._setViewInfos('initX', viewX);
    this._setViewInfos('initY', viewY);
    this._setViewInfos('x', viewX);
    this._setViewInfos('y', viewY);

    this._update();
  }
  private _bindEvents() {
    EventStore.on('mousewheel', this._handleMouseWheel.bind(this));
    EventStore.on('mousedown', this._handleMouseDown.bind(this));
    EventStore.on('mousemove', this._handleMouseMove.bind(this));
    EventStore.on('mouseup', this._handleMouseUp.bind(this));
  }

  private _imageMove(e: MouseEvent, offsetX: number, offsetY: number) {
    const realX: number = this.mouseMoveInfos.preX + offsetX;
    const realY: number = this.mouseMoveInfos.preY + offsetY;

    this._setViewInfos('x', realX);
    this._setViewInfos('y', realY);

    this._update();
  }
  private _imageScale(e: WheelEvent, direction: Image.IDirection) {
    let rate: number =
      direction === 'up'
        ? 1 / this.scaleInfos.scaleStep
        : this.scaleInfos.scaleStep;

    const nextWidth: number = this.viewInfos.width * rate;
    const nextHeight: number = this.viewInfos.height * rate;

    const scale: number = nextWidth / this.viewInfos.initWidth;

    this._setViewInfos('scale', scale);
    this._setViewInfos('width', nextWidth);
    this._setViewInfos('height', nextHeight);

    this._update();
  }

  private _handleMouseWheel(e: WheelEvent, direction: Image.IDirection): void {
    this._imageScale(e, direction);
  }
  private _handleMouseDown(e: MouseEvent): void {
    this.mouseMoveInfos.startX = e.x;
    this.mouseMoveInfos.startY = e.y;
    this.mouseMoveInfos.preX = this.viewInfos.x;
    this.mouseMoveInfos.preY = this.viewInfos.y;
  }
  private _handleMouseMove(e: MouseEvent): void {
    const offsetX: number = -(this.mouseMoveInfos.startX - e.x);
    const offsetY: number = -(this.mouseMoveInfos.startY - e.y);
    this._imageMove(e, offsetX, offsetY);
  }
  private _handleMouseUp(e: MouseEvent): void {}

  private _setViewInfos(key: keyof Image.IViewInfos, value: number) {
    this.viewInfos[key] = value;
  }

  private _update() {
    this.clear();

    this.ctx.drawImage(
      this.imageInfos.image,
      this.viewInfos.x,
      this.viewInfos.y,
      this.viewInfos.width,
      this.viewInfos.height,
    );
  }
}

export default ImageCanvas;
