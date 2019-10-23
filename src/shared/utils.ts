/**
 * 简单的深拷贝
 * @param obj
 */
export function deepClone(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 加载图片，返回 Promise
 * @param url string
 */
export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.onerror = (e: any) => reject(e);
    image.onload = (e: Event) => resolve(image);
  });
}
