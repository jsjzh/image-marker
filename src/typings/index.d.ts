declare type IFn = (...params: any) => any;

declare namespace E {
  interface IEvnets {
    [k: string]: IFn[];
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
