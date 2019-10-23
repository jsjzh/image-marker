import Canvas from './Canvas';
import EventStore from './EventStore';
import ImageCanvas from './ImageCanvas';

class MarkCanvas extends Canvas {
  public image: ImageCanvas;
  /**
   * 实际绘制的时候用的 paths 路径点
   * @memberof MarkCanvas
   */
  public showStore: Draw.IPath[];
  public config: Draw.IConfig;
  public status: Draw.IStatus;
  public viewInfos: Image.IViewInfos;
  public drawInfos: Draw.IDrawInfos;
  public shiftInfos: Draw.IShiftInfos;
  public bindStatus: Draw.IBindStatus;
  public handler: any;

  public constructor(
    dom: HTMLCanvasElement,
    image: ImageCanvas,
    config: T.IDrawStyle | {},
  ) {
    super(dom);

    this.image = image;

    this.viewInfos = this.image.viewInfos;

    this.showStore = [];

    this.config = {
      drawType: 'rect',
      styles: {
        width: '2',
        color: '#f5222d',
        shadow: '#2b2b2b 5 2 2',
        ...config,
      },
      scaleMax: 5,
      scaleMin: 0.2,
      scaleStep: 0.8,
    };
    this.drawInfos = {
      startDrawX: 0,
      startDrawY: 0,
      path: {
        pathKey: '',
        type: '',
        styles: {
          width: '',
          color: '',
          shadow: '',
        },
        points: [],
      },
      clear() {
        this.startDrawX = 0;
        this.startDrawY = 0;
        this.path = {
          pathKey: '',
          type: '',
          styles: {
            width: '',
            color: '',
            shadow: '',
          },
          points: [],
        };
      },
    };
    this.shiftInfos = {
      startShiftX: 0,
      startShiftY: 0,
      tempStore: [],
      clear() {
        this.startShiftX = 0;
        this.startShiftY = 0;
        this.tempStore = [];
      },
    };
    this.status = {
      mouseDownShift: false,
      mouseDownDraw: false,
      mouseDownDuring: false,
      ctrlDown: false,
    };
    this.bindStatus = {
      scaleBind: false,
      shiftBind: false,
      drawBind: false,
      keyboardBind: false,
    };
    this.handler = {
      handleMouseWheel: null,
      handleConetextMenu: null,
      handleMouseDownShift: null,
      handleMouseMoveShift: null,
      handleMouseUpShift: null,
      handleMouseDownDraw: null,
      handleMouseMoveDraw: null,
      handleMouseUpDraw: null,
      handleKeyDown: null,
      handleKeyUp: null,
      handleKeyPress: null,
    };
  }

  public init() {
    this.mountEvents();
    this.bindEvents();
    this.setConfigStyle();
  }

  public reloadImage(paths: Draw.IPath[]) {
    this.showStore = paths;
  }

  public setDrawType(type: Draw.IDrawType) {
    this.config.drawType = type;
  }

  public setConfigStyle(config?: Draw.IStyle) {
    let styles: any = config || this.config.styles;
    Object.keys(styles).forEach((key: any) => {
      styles[key] && this.setLineStyle(key, styles[key]);
    });
  }

  public drawPolygonStart(e: MouseEvent) {
    let x = this.removeFrameX(e.clientX);
    let y = this.removeFrameY(e.clientY);

    if (!this.drawInfos.path.points.length) {
      this.drawInfos.path = this.getPolygonPath([], [x, y]);
    } else {
      this.drawInfos.path.points.push([x, y]);
    }
  }
  public drawPolygonMove(e: MouseEvent) {
    let nextX = this.removeFrameX(e.clientX);
    let nextY = this.removeFrameY(e.clientY);

    const flagX = this.isOutsideViewX(e);
    const flagY = this.isOutsideViewY(e);

    flagX &&
      (nextX =
        flagX === 'left'
          ? this.viewInfos.x
          : this.viewInfos.x + this.viewInfos.width);
    flagY &&
      (nextY =
        flagY === 'top'
          ? this.viewInfos.y
          : this.viewInfos.y + this.viewInfos.height);

    let path = this.getPolygonPath(this.drawInfos.path.points, [nextX, nextY]);

    this.clear();

    this.drawPath(path);
    this.drawOldPath();
  }
  public drawPolygonEnd(e: MouseEvent) {}

  public drawRectStart(e: MouseEvent) {
    this.drawInfos.startDrawX = this.removeFrameX(e.clientX);
    this.drawInfos.startDrawY = this.removeFrameY(e.clientY);
  }
  public drawRectMove(e: MouseEvent) {
    let width = this.removeFrameX(e.clientX) - this.drawInfos.startDrawX;
    let height = this.removeFrameY(e.clientY) - this.drawInfos.startDrawY;

    const flagX = this.isOutsideViewX(e);
    const flagY = this.isOutsideViewY(e);

    flagX &&
      (width =
        flagX === 'left'
          ? this.viewInfos.x - this.drawInfos.startDrawX
          : this.viewInfos.x +
            this.viewInfos.width -
            this.drawInfos.startDrawX);
    flagY &&
      (height =
        flagY === 'top'
          ? this.viewInfos.y - this.drawInfos.startDrawY
          : this.viewInfos.y +
            this.viewInfos.height -
            this.drawInfos.startDrawY);

    this.drawInfos.path = this.getRectPath(
      this.drawInfos.startDrawX,
      this.drawInfos.startDrawY,
      width,
      height,
    );

    this.clear();

    this.drawPath(this.drawInfos.path);
    this.drawOldPath();
  }
  public drawRectEnd(e: MouseEvent) {
    this.saveStore();
  }

  public shiftStart(e: MouseEvent) {
    this.shiftInfos.startShiftX = this.removeFrameX(e.clientX);
    this.shiftInfos.startShiftY = this.removeFrameY(e.clientY);
  }
  public shiftMove(e: MouseEvent) {
    const offsetX = this.removeFrameX(e.clientX) - this.shiftInfos.startShiftX;
    const offsetY = this.removeFrameY(e.clientY) - this.shiftInfos.startShiftY;

    this.shiftInfos.tempStore = this.showStore.map((path: Draw.IPath) => ({
      ...path,
      points: path.points.map((point: Draw.IPoint) => [
        point[0] + offsetX,
        point[1] + offsetY,
      ]),
    }));

    this.clear();

    this.shiftInfos.tempStore.forEach((path: Draw.IPath) =>
      this.drawPath(path),
    );
  }
  public shiftEnd(e: MouseEvent) {
    this.showStore = this.shiftInfos.tempStore;
    this.shiftInfos.clear();
  }

  public scaleDraw(e: WheelEvent, direction: 'up' | 'down') {
    let rate =
      direction === 'up' ? 1 / this.config.scaleStep : this.config.scaleStep;

    let tempStore = this.showStore.map((path: Draw.IPath) => ({
      ...path,
      points: path.points.map((point: Draw.IPoint) => [
        // 稍微解释一下，这个地方因为画的框是以 draw 层画布最左上角为基础的
        // 但是我们要的是以 view 层最左上角（以后希望改成鼠标焦点缩放）为零点缩放
        point[0] * rate - (rate - 1) * this.viewInfos.x,
        point[1] * rate - (rate - 1) * this.viewInfos.y,
      ]),
    }));

    this.clear();

    tempStore.forEach((path: Draw.IPath) => this.drawPath(path));

    this.showStore = tempStore;
  }

  public rollbackPath() {
    this.showStore.splice(this.showStore.length - 1, 1);
    this.clear();
    this.drawOldPath();
  }

  public handleMouseWheel(e: WheelEvent) {
    const direction = e.deltaY < 0 ? 'up' : 'down';
    EventStore.emit('mousewheel', e, direction);
    EventStore.emit('sacle', e, direction);
    this.scaleDraw(e, direction);
  }
  public handleConetextMenu(e: MouseEvent) {
    e.preventDefault();
    if (this.status.mouseDownDuring) {
      this.saveStore();
      this.status.mouseDownDuring = false;
    }
  }

  public handleMouseDownShift(e: MouseEvent) {
    this.status.mouseDownShift = true;
    EventStore.emit('mousedown', e);
    EventStore.emit('willShift', e);
    this.shiftStart(e);
  }
  public handleMouseMoveShift(e: MouseEvent) {
    if (this.status.mouseDownShift) {
      EventStore.emit('mousemove', e);
      EventStore.emit('shifting', e);
      this.shiftMove(e);
    }
  }
  public handleMouseUpShift(e: MouseEvent) {
    this.status.mouseDownShift = false;
    EventStore.emit('mouseup', e);
    EventStore.emit('shifted', e);
    this.shiftEnd(e);
  }

  public handleMouseDownDraw(e: MouseEvent) {
    if (e.button === 0) {
      if (this.isOutsizeView(e)) return;
      this.status.mouseDownDraw = true;
      EventStore.emit('willDraw', e);
      if (this.config.drawType === 'rect') {
        this.drawRectStart(e);
      }
      if (this.config.drawType === 'polygon') {
        // 当鼠标左键被按下
        this.status.mouseDownDuring = true;
        this.drawPolygonStart(e);
      }
    }
  }
  public handleMouseMoveDraw(e: MouseEvent) {
    EventStore.emit('drawing', e);
    if (this.status.mouseDownDuring) {
      if (
        this.drawInfos.path.points.length &&
        this.config.drawType === 'polygon'
      ) {
        this.drawPolygonMove(e);
      }
    }
    if (this.status.mouseDownDraw) {
      if (this.config.drawType === 'rect') {
        this.drawRectMove(e);
      }
    }
  }
  public handleMouseUpDraw(e: MouseEvent) {
    EventStore.emit('drawn', e);
    if (this.config.drawType === 'rect') {
      this.drawRectEnd(e);
    }
    if (this.config.drawType === 'polygon') {
      this.drawPolygonEnd(e);
    }
    this.status.mouseDownDraw = false;
  }

  public handleKeyDown(e: KeyboardEvent) {
    if (this.status.mouseDownDraw || this.status.mouseDownDuring) return;
    if (e.keyCode === 32 && !this.bindStatus.shiftBind) {
      this.unBindDrawEvents();
      this.bindShiftEvents();
    }
    if (e.keyCode === 17 && !this.bindStatus.scaleBind) {
      this.bindScaleEvents();
    }
    if (e.keyCode === 8) {
      this.rollbackPath();
    }
  }
  public handleKeyUp(e: KeyboardEvent) {
    if (e.keyCode === 32 && this.bindStatus.shiftBind) {
      if (this.status.mouseDownShift) return;
      this.unBindShiftEvents();
      this.bindDrawEvents();
    }
    if (e.keyCode === 17 && this.bindStatus.scaleBind) {
      this.unBindScaleEvents();
    }
  }

  public handleKeyPress(e: KeyboardEvent) {
    if (e.keyCode === 113) {
      this.config.drawType =
        this.config.drawType === 'rect' ? 'polygon' : 'rect';
    }
  }

  public getRectPath(
    x: number,
    y: number,
    width: number,
    height: number,
  ): Draw.IPath {
    // 所有的图形都遵照顺时针方向标注 point 点
    return {
      pathKey: `type-rect-${Number(new Date())}`,
      type: 'rect',
      styles: {
        width: this.config.styles.width,
        color: this.config.styles.color,
        shadow: this.config.styles.shadow,
      },
      points: [
        [x, y],
        [x + width, y],
        [x + width, y + height],
        [x, y + height],
      ],
    };
  }
  public getPolygonPath(
    prePoints: Draw.IPoint[] | [],
    nextPoint: Draw.IPoint,
  ): Draw.IPath {
    // 所有的图形都遵照顺时针方向标注 point 点
    return {
      pathKey: `type-polygon-${Number(new Date())}`,
      type: 'polygon',
      styles: {
        width: this.config.styles.width,
        color: this.config.styles.color,
        shadow: this.config.styles.shadow,
      },
      points: [...prePoints, nextPoint],
    };
  }

  public drawPath(paths: Draw.IPath): void {
    const { type, styles, points } = paths;
    this.setConfigStyle(styles);

    const tempPoints = points.slice();
    const startPoint = tempPoints.splice(0, 1)[0];

    this.ctx.beginPath();
    this.ctx.moveTo.apply(this.ctx, startPoint);
    tempPoints.forEach((path: Draw.IPoint) =>
      this.ctx.lineTo.apply(this.ctx, path),
    );
    this.ctx.closePath();
    this.ctx.stroke();

    this.setConfigStyle();
  }
  public drawOldPath() {
    this.showStore.forEach((paths: any) => this.drawPath(paths));
  }

  public saveStore() {
    if (this.drawInfos.path.points.length) {
      EventStore.emit('addPath', this.drawInfos.path);
      this.showStore.push(this.drawInfos.path);
      this.drawInfos.clear();
    }
    this.clear();
    this.drawOldPath();
  }

  public getRelativeImagePaths() {
    // 最终会当成 json 数据返回的 store，里面的路径都是相对底图，view 层
    // 简单来说下面的 showStore 是以 canvas 的最左上侧为 (0,0)
    // 而 store 是以 view 层的最左上角为 (0,0) 的
    // 所以说当图片缩放以及移动该 store 都不会变
    // 只有在改变了图形的形状，或者删除某些线的时候会变化
    // showStore 是专门展示给界面看的，所以说当图片缩放以及移动的时候
    return this.showStore.map((path: Draw.IPath) => ({
      ...path,
      points: path.points.map((points: Draw.IPoint) => [
        (points[0] - this.viewInfos.x) / this.viewInfos.scale,
        (points[1] - this.viewInfos.y) / this.viewInfos.scale,
      ]),
    }));
  }

  public setLineStyle(key: 'width' | 'color' | 'shadow', value: string) {
    let _value = value.toString().replace(/px/g, '');
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    const map = {
      width(_value: any) {
        that.ctx['lineWidth'] = _value;
      },
      color(_value: any) {
        that.ctx['strokeStyle'] = _value;
      },
      shadow(value: any) {
        // black 1px 1px 1px
        // shadowColor shadowBlur shadowOffsetX shadowOffsetY
        let arr = _value.split(' ');
        if (arr.length && arr.length === 3) {
          that.ctx['shadowColor'] = arr[0];
          that.ctx['shadowOffsetX'] = Number(arr[1]);
          that.ctx['shadowOffsetY'] = Number(arr[2]);
        }
        if (arr.length && arr.length === 4) {
          that.ctx['shadowColor'] = arr[0];
          that.ctx['shadowBlur'] = Number(arr[1]);
          that.ctx['shadowOffsetX'] = Number(arr[2]);
          that.ctx['shadowOffsetY'] = Number(arr[3]);
        }
      },
    };
    map[key](_value);
  }

  public removeFrameX(num: number): number {
    // 因为 canvas 最左上角相对屏幕仍有一些距离，某些时候
    // 比如获取的是 MouseEvent 的 clientX 的时候
    // 我们要的是相对 canvas 的 clientX，所以需要减去 canvas 相对屏幕的那些距离
    return num - this.canvasInfos.realScreenX;
  }
  public removeFrameY(num: number): number {
    return num - this.canvasInfos.realScreenY;
  }

  public isOutsideViewX(e: MouseEvent) {
    const realX = this.removeFrameX(e.clientX);
    if (realX < this.viewInfos.x) return 'left';
    if (realX > this.viewInfos.x + this.viewInfos.width) return 'right';
    return false;
  }
  public isOutsideViewY(e: MouseEvent) {
    const realY = this.removeFrameY(e.clientY);
    if (realY < this.viewInfos.y) return 'top';
    if (realY > this.viewInfos.y + this.viewInfos.height) return 'bottom';
    return false;
  }
  public isOutsizeView(e: MouseEvent) {
    return !!(this.isOutsideViewX(e) || this.isOutsideViewY(e));
  }

  public bindScaleEvents() {
    this.ca.addEventListener('mousewheel', this.handler.handleMouseWheel);
    this.bindStatus.scaleBind = true;
  }
  public unBindScaleEvents() {
    this.ca.removeEventListener('mousewheel', this.handler.handleMouseWheel);
    this.bindStatus.scaleBind = false;
  }
  public bindShiftEvents() {
    this.ca.addEventListener('mousedown', this.handler.handleMouseDownShift);
    this.ca.addEventListener('mousemove', this.handler.handleMouseMoveShift);
    this.ca.addEventListener('mouseup', this.handler.handleMouseUpShift);
    this.bindStatus.shiftBind = true;
  }
  public unBindShiftEvents() {
    this.ca.removeEventListener('mousedown', this.handler.handleMouseDownShift);
    this.ca.removeEventListener('mousemove', this.handler.handleMouseMoveShift);
    this.ca.removeEventListener('mouseup', this.handler.handleMouseUpShift);
    this.bindStatus.shiftBind = false;
  }
  public bindDrawEvents() {
    this.ca.addEventListener('mousedown', this.handler.handleMouseDownDraw);
    this.ca.addEventListener('contextmenu', this.handler.handleConetextMenu);
    this.ca.addEventListener('mousemove', this.handler.handleMouseMoveDraw);
    this.ca.addEventListener('mouseup', this.handler.handleMouseUpDraw);
    this.bindStatus.drawBind = true;
  }
  public unBindDrawEvents() {
    this.ca.removeEventListener('mousedown', this.handler.handleMouseDownDraw);
    this.ca.removeEventListener('contextmenu', this.handler.handleConetextMenu);
    this.ca.removeEventListener('mousemove', this.handler.handleMouseMoveDraw);
    this.ca.removeEventListener('mouseup', this.handler.handleMouseUpDraw);
    this.bindStatus.drawBind = false;
  }
  public bindKeyboardEvents() {
    window.addEventListener('keydown', this.handler.handleKeyDown);
    window.addEventListener('keyup', this.handler.handleKeyUp);
    window.addEventListener('keypress', this.handler.handleKeyPress);
    this.bindStatus.keyboardBind = true;
  }
  public unBindKeyboardEvents() {
    window.removeEventListener('keydown', this.handler.handleKeyDown);
    window.removeEventListener('keyup', this.handler.handleKeyUp);
    window.removeEventListener('keypress', this.handler.handleKeyPress);
    this.bindStatus.keyboardBind = false;
  }

  public mountEvents() {
    this.handler.handleMouseWheel = this.handleMouseWheel.bind(this);
    this.handler.handleConetextMenu = this.handleConetextMenu.bind(this);

    this.handler.handleMouseDownShift = this.handleMouseDownShift.bind(this);
    this.handler.handleMouseMoveShift = this.handleMouseMoveShift.bind(this);
    this.handler.handleMouseUpShift = this.handleMouseUpShift.bind(this);

    this.handler.handleMouseDownDraw = this.handleMouseDownDraw.bind(this);
    this.handler.handleMouseMoveDraw = this.handleMouseMoveDraw.bind(this);
    this.handler.handleMouseUpDraw = this.handleMouseUpDraw.bind(this);

    this.handler.handleKeyDown = this.handleKeyDown.bind(this);
    this.handler.handleKeyUp = this.handleKeyUp.bind(this);
    this.handler.handleKeyPress = this.handleKeyPress.bind(this);
  }
  public bindEvents() {
    this.bindDrawEvents();
    this.bindKeyboardEvents();
  }
  public unBindEvents() {
    this.unBindShiftEvents();
    this.unBindDrawEvents();
    this.unBindScaleEvents();
    this.unBindKeyboardEvents();
  }

  public destroy() {
    this.unBindEvents();
    EventStore.removeAll();
  }
}

export default MarkCanvas;

// 有个想法，事件绑定相关的东西，是不是还有很多地方可以改善
// 比如切换 drawType 的时候，比如鼠标点击的时候，这样就不用在点击函数里面判断类型了
