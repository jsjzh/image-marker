export function getPositionCanvas(): HTMLCanvasElement {
  const canvas: HTMLCanvasElement = document.createElement('canvas');
  canvas.style.cssText = ';width:100%;height:100%;position:absolute;';
  canvas.innerText =
    '哦豁，你的浏览器好像不支持 canvas，使用 chrome 浏览器食用最佳';
  return canvas;
}

export function getHtmlDiv(htmlDiv: string | HTMLElement): HTMLElement {
  let div;
  if (typeof htmlDiv === 'string') {
    div = document.getElementById(htmlDiv);
    if (!div) throw new Error('未找到画布容器');
  } else {
    div = htmlDiv;
  }

  return div;
}
