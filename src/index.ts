import Event from './core/Event';
import ImageCanvas from './core/ImageCanvas';
import DrawCanvas from './core/DrawCanvas';
import EventStore from './core/EventStore';
import { getPositionCanvas, getHtmlDiv } from '@/shared/dom';

interface IConfig {
  parent: string | HTMLElement;
  url: string;
  drawStyle?: T.IDrawStyle;

  hooks?: {
    addPath?: IFn;
    willDraw?: IFn;
    drawing?: IFn;
    drawn?: IFn;
    willShift?: IFn;
    shifting?: IFn;
    shifted?: IFn;
    sacle?: IFn;
  };
}

/**
 * @todo resize，当 window 窗口变化的时候，canvas 画布内容并未随着变化
 * @todo 发现存在滚动条的时候，滚动滚动条也会导致画图位置不正确
 *
 * @todo 现在是这么样的想法，初始化的时候要给一个 url，表示初始的画布，另外还要给一个 loadImage 方法，重设画布
 * @todo 然后设置
 */
class ImageMarker extends Event {
  public config: IConfig;
  public hooks: IConfig['hooks'];

  public parent!: HTMLElement;
  public imageCa!: ImageCanvas;
  public drawCa!: DrawCanvas;

  public constructor(config: IConfig) {
    super();
    this.config = config;
    this.hooks = config.hooks || {};
  }

  public async init() {
    const { config } = this;
    const { parent } = config;

    const [parentRef, imageCanvasRef, drawCanvasRef] = this._initContainer(
      parent,
    );

    const [imageCa, drawCa] = await this._initInstance(
      config,
      imageCanvasRef,
      drawCanvasRef,
    );

    this.parent = parentRef;
    this.imageCa = imageCa;
    this.drawCa = drawCa;
    this._mountEvents();
  }

  /**
   * 设置当前的画笔状态
   * @param drawType 可传入 rect 和 polygon，代表矩形和多边形
   * @param width 当前画笔宽度
   * @param color 当前画笔颜色
   * @param shadow 当前画笔阴影
   */
  public setDrawStyle({ drawType, width, color, shadow }: T.IDrawStyle) {
    drawType && this.drawCa.setDrawType(drawType);
    (width || color || shadow) &&
      this.drawCa.setConfigStyle({ width, color, shadow });
  }
  /**
   * 设置某一条已经绘制的 path 的样式
   * @param key 创建 path 的时候唯一 key
   * @returns 返回被设置的那条 path，如果未设置成功则返回 false
   */
  public setPathStyle(key: T.IPathKey, { width, color, shadow }: T.IStyle) {
    const curr = this.drawCa.showStore.find(
      (path: T.IPath) => path.pathKey === key,
    );
    if (curr) {
      width && (curr.styles.width = width);
      color && (curr.styles.color = color);
      shadow && (curr.styles.shadow = shadow);
      this.drawCa.clear();
      this.drawCa.drawOldPath();
      return curr;
    }
    return false;
  }
  /**
   * 删除某一条已经绘制的 path
   * @param key 创建 path 的时候唯一 key
   * @returns 返回被删除的那条 path，如果未删除成功则返回 false
   */
  public removePath(key: T.IPathKey) {
    const curr = this.drawCa.showStore.find(
      (path: T.IPath) => path.pathKey === key,
    );

    if (curr) {
      this.drawCa.showStore = this.drawCa.showStore.filter(
        (path: T.IPath) => path.pathKey !== key,
      );
      this.drawCa.clear();
      this.drawCa.drawOldPath();
      return curr;
    }
    return false;
  }
  /**
   * 选择（高亮）某一条已经绘制的 path
   * @param key 创建 path 的时候唯一 key
   * @returns 返回该 key 所对应的 path，若未找到则返回 null
   */
  public selectPath(key: T.IPathKey) {}
  /**
   * 重新计算当前的 image 层和 draw 层的高度，一般用在改变了 canvas 的实际高度的时候
   * 比如改变了 windows 的大小的时候，就需要调用该方法，该方法会重新计算 image 层的高度
   * 然后将已有的 paths 重新绘制
   */
  public resize(): void {
    // let tempPath = this.draw.showStore;
    // this.image.resize();
    // this.draw.resize();
    // this.image.reloadImage().then(() => {
    //   this.draw.clear();
    //   this.draw.reloadImage(tempPath);
    //   this.draw.drawOldPath();
    // });
  }
  /**
   * 返回当前的所有 paths
   */
  public getAllPaths() {
    return this.drawCa.getRelativeImagePaths();
  }
  /**
   * 直接对当前图片导入 paths，会重置当前的 image 层移动和缩放状态
   * @param paths 符合格式的 paths
   */
  public importPaths(paths: T.IPath[]) {
    // 导入的时候会重置已经移动或者缩放过的 image 层，后续可以做成先缓存当前的缩放和移动状态
    // 导入成功之后再重新恢复这个缩放和移动的状态
  }
  /**
   * 更改当前的 image 层并清除 draw 层所有路径
   * @param url 导入的图片信息
   * @param paths 导入 paths 信息，也可以选择不导入，那就开始新的绘制
   */
  public importImage(url: string, paths?: T.IPath[]) {
    this.imageCa.reloadImage(url).then(() => {
      this.drawCa.clear();
      this.drawCa.reloadImage(paths || []);
      this.drawCa.drawOldPath();
    });
  }
  /**
   * 销毁当前创建的画布
   */
  public destroy() {
    this.imageCa && this.imageCa.destroy();
    this.drawCa && this.drawCa.destroy();
    this.parent.innerHTML = '';
  }

  private _initContainer(
    parent: IConfig['parent'],
  ): [HTMLElement, HTMLCanvasElement, HTMLCanvasElement] {
    const parentRef = getHtmlDiv(parent);
    const imageCanvasRef = getPositionCanvas();
    const drawCanvasRef = getPositionCanvas();
    parentRef.style.cssText += ';width:100%;height:100%;position:relative;';
    drawCanvasRef.style.zIndex = '10';
    parentRef.append(imageCanvasRef, drawCanvasRef);
    return [parentRef, imageCanvasRef, drawCanvasRef];
  }

  private async _initInstance(
    config: IConfig,
    imageCanvasRef: HTMLCanvasElement,
    drawCanvasRef: HTMLCanvasElement,
  ): Promise<[ImageCanvas, DrawCanvas]> {
    const imageCa = new ImageCanvas(imageCanvasRef);
    await imageCa.init(config.url);
    const drawCa = new DrawCanvas(
      drawCanvasRef,
      imageCa,
      config.drawStyle || {},
    );
    drawCa.init();
    return [imageCa, drawCa];
  }

  /**
   * 挂载用户自定义的 hooks
   */
  private _mountEvents() {
    const hooks: any = this.hooks;
    hooks &&
      Object.keys(hooks).forEach((key: string) =>
        EventStore.on(key, hooks[key]),
      );
  }
}

export default ImageMarker;
