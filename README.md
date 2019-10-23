# image-marker

一个非常简单好使的图像标注工具。

## 说明

沉淀于公司项目，适用各种前端框架。

## 使用

```html
<div id="container"></div>
```

```javascript
const container = document.getElementById('container');
const url = 'http://img.souche.com/f2e/b32a9f63833a46d50c1847a42886b318.png';

const marker = new imageMarker({ container, url });
marker.init();
```

## 待办
