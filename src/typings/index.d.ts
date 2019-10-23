declare type IFn = (...params: any) => any;

declare namespace Common {
  type IDrawType = 'rect' | 'polygon';
}

declare namespace Event {
  interface IEvnets {
    [k: string]: IFn[];
  }
}

declare namespace Canvas {
  interface ICanvasInfos {
    width: number;
    height: number;
    realScreenX: number;
    realScreenY: number;
  }
}

declare namespace Image {
  type IDirection = 'up' | 'down';

  interface IImageInfos {
    image: HTMLImageElement;
    width: number;
    height: number;
    rate: number;
  }

  interface IScaleInfos {
    scaleMax: number;
    scaleMin: number;
    scaleStep: number;
  }

  interface IViewInfos {
    initWidth: number;
    initHeight: number;
    initX: number;
    initY: number;
    width: number;
    height: number;
    x: number;
    y: number;
    scale: number;
  }

  interface IMouseMoveInfos {
    startX: number;
    startY: number;
    preX: number;
    preY: number;
  }
}

declare namespace Draw {
  interface IStyle {
    width?: number | string;
    color?: string;
    shadow?: string;
  }

  interface IPath {
    pathKey: string;
    type: string;
    styles: Draw.IStyle;
    points: any[];
  }

  interface IConfig {
    styles: IStyle;
    drawType: Common.IDrawType;
    scaleMax: number;
    scaleMin: number;
    scaleStep: number;
  }

  interface IDrawInfos {
    startDrawX: number;
    startDrawY: number;
    path: Draw.IPath;
    clear: IFn;
  }

  interface IShiftInfos {
    startShiftX: number;
    startShiftY: number;
    // 在鼠标拖动的时候坐标的点改变了，需要一个临时存储处
    // 在放开鼠标之后把这些赋值给 showStore
    tempStore: Draw.IPath[];
    clear: IFn;
  }

  interface IStatus {
    mouseDownShift: boolean;
    // 针对的是持续性的画法，比如正方形，摁住鼠标来画的
    mouseDownDraw: boolean;
    // 针对的是持续性的画法，比如正方形，摁住鼠标来画的
    // 然后下次点击的时候再画下一个点，并不是持续性的
    mouseDownDuring: boolean;
    ctrlDown: boolean;
  }

  // 该对象的作用是可以参考 keyboardEvent，因为只要摁着键盘，就会一直触发事件
  interface IBindStatus {
    scaleBind: boolean;
    shiftBind: boolean;
    drawBind: boolean;
    keyboardBind: boolean;
  }
}

declare namespace T {
  type IDrawType = 'rect' | 'polygon';

  type IPathKey = string | number;

  interface IStyle {
    width?: number | string;
    color?: string;
    shadow?: string;
  }

  interface IDrawStyle extends IStyle {
    drawType?: T.IDrawType;
  }

  interface IPath {
    pathKey: string;
    type: string;
    styles: IStyle;
    points: any[];
  }
}
