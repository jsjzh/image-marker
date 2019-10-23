/* image-marker version is 0.0.1 */
var imageMarker = (function () {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }

    var Event = /** @class */ (function () {
        function Event() {
            this._events = {};
        }
        /**
         * 声明事件监听
         * @param key 事件名称
         * @param func 被触发的函数
         */
        Event.prototype.on = function (key, func) {
            if (Array.isArray(this._events[key])) {
                this._events[key].push(func);
            }
            else {
                this._events[key] = [];
                this._events[key].push(func);
            }
        };
        /**
         * 触发某一事件下所有函数
         * @param key 想要触发的事件名称
         * @param arg 被触发的函数们会传入的参数
         */
        Event.prototype.emit = function (key) {
            var arg = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                arg[_i - 1] = arguments[_i];
            }
            var args = Array.prototype.slice.call(arguments, 1);
            var context = args[args.length] === key ? null : args[args.length];
            this._events[key] &&
                this._events[key].forEach(function (func) {
                    func.apply(context, args);
                });
        };
        /**
         * 删除某一事件的所有执行函数
         * @param key 事件名称
         */
        Event.prototype.remove = function (key) {
            delete this._events[key];
        };
        /**
         * 删除所有的监听
         */
        Event.prototype.removeAll = function () {
            var _this = this;
            Object.keys(this._events).forEach(function (key) { return delete _this._events[key]; });
        };
        return Event;
    }());

    var Canvas = /** @class */ (function (_super) {
        __extends(Canvas, _super);
        function Canvas(dom) {
            var _this = _super.call(this) || this;
            _this.ca = dom;
            _this.ctx = dom.getContext('2d');
            _this.canvasInfos = {
                // canvas 的宽度和高度
                width: 0,
                height: 0,
                // canvas 左上角相对屏幕的坐标
                realScreenX: 0,
                realScreenY: 0,
            };
            _this.getCanvasClientReact();
            _this.initCanvasWidthHeight();
            return _this;
        }
        Canvas.prototype.getCanvasClientReact = function () {
            var _a = this.ca.getBoundingClientRect(), width = _a.width, height = _a.height, x = _a.x, y = _a.y;
            this.canvasInfos.width = width;
            this.canvasInfos.height = height;
            this.canvasInfos.realScreenX = x;
            this.canvasInfos.realScreenY = y;
        };
        Canvas.prototype.initCanvasWidthHeight = function () {
            // 为什么有这一步呢，因为 canvas 的画布大小要用 width 和 height 来直接设定
            // style 里面的 width 和 height 并不是 canvas 的画布大小
            this.ca.width = this.canvasInfos.width;
            this.ca.height = this.canvasInfos.height;
        };
        Canvas.prototype.clear = function () {
            this.ctx.clearRect(0, 0, this.canvasInfos.width, this.canvasInfos.height);
        };
        Canvas.prototype.resize = function () {
            this.getCanvasClientReact();
            this.initCanvasWidthHeight();
        };
        return Canvas;
    }(Event));

    var EventStore = /** @class */ (function (_super) {
        __extends(EventStore, _super);
        function EventStore() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return EventStore;
    }(Event));
    var EventStore$1 = new EventStore();

    /**
     * 简单的深拷贝
     * @param obj
     */
    /**
     * 加载图片，返回 Promise
     * @param url string
     */
    function loadImage(url) {
        return new Promise(function (resolve, reject) {
            var image = new Image();
            image.src = url;
            image.onerror = function (e) { return reject(e); };
            image.onload = function (e) { return resolve(image); };
        });
    }

    /**
     * @note ImageCanvas image 层几乎不做任何的监听，他的所有事件都通过 EventStore 在 draw 层触发
     * @todo 限制缩放的倍率
     * @todo 做成鼠标放置位置放大缩小的样子
     */
    var ImageCanvas = /** @class */ (function (_super) {
        __extends(ImageCanvas, _super);
        function ImageCanvas(ref) {
            var _this = _super.call(this, ref) || this;
            _this.imageInfos = {
                image: new Image(),
                width: 0,
                height: 0,
                rate: 0,
            };
            _this.scaleInfos = {
                scaleMax: 5,
                scaleMin: 0.2,
                scaleStep: 0.8,
            };
            _this.mouseMoveInfos = {
                startX: 0,
                startY: 0,
                preX: 0,
                preY: 0,
            };
            _this.viewInfos = {
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
            return _this;
        }
        /**
         * 该方法会重新初始化 image，所有关于 image 的信息会重置
         * @param url 图片地址
         */
        ImageCanvas.prototype.init = function (url) {
            return __awaiter(this, void 0, void 0, function () {
                var image, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, loadImage(url)];
                        case 1:
                            image = _a.sent();
                            this._setImageInfos(image);
                            this._bindEvents();
                            return [2 /*return*/, this];
                        case 2:
                            e_1 = _a.sent();
                            return [2 /*return*/, Promise.reject(e_1)];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 该方法和 init 的区别就是不会再次进行事件绑定
         * @param url string
         */
        ImageCanvas.prototype.reloadImage = function (url) {
            return __awaiter(this, void 0, void 0, function () {
                var image, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!!url) return [3 /*break*/, 1];
                            this._setImageInfos(this.imageInfos.image);
                            return [3 /*break*/, 4];
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, loadImage(url)];
                        case 2:
                            image = _a.sent();
                            this._setImageInfos(image);
                            return [3 /*break*/, 4];
                        case 3:
                            e_2 = _a.sent();
                            return [2 /*return*/, Promise.reject(e_2)];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ImageCanvas.prototype.destroy = function () {
            EventStore$1.removeAll();
        };
        ImageCanvas.prototype._setImageInfos = function (image) {
            var viewWidth;
            var viewHeight;
            var viewX;
            var viewY;
            this.imageInfos.image = image;
            this.imageInfos.width = image.width;
            this.imageInfos.height = image.height;
            this.imageInfos.rate = image.width / image.height;
            if (this.imageInfos.width >= this.imageInfos.height) {
                viewWidth = this.canvasInfos.width;
                viewHeight = viewWidth / this.imageInfos.rate;
                viewX = 0;
                viewY = (this.canvasInfos.height - viewHeight) / 2;
            }
            else {
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
        };
        ImageCanvas.prototype._bindEvents = function () {
            EventStore$1.on('mousewheel', this._handleMouseWheel.bind(this));
            EventStore$1.on('mousedown', this._handleMouseDown.bind(this));
            EventStore$1.on('mousemove', this._handleMouseMove.bind(this));
            EventStore$1.on('mouseup', this._handleMouseUp.bind(this));
        };
        ImageCanvas.prototype._imageMove = function (e, offsetX, offsetY) {
            var realX = this.mouseMoveInfos.preX + offsetX;
            var realY = this.mouseMoveInfos.preY + offsetY;
            this._setViewInfos('x', realX);
            this._setViewInfos('y', realY);
            this._update();
        };
        ImageCanvas.prototype._imageScale = function (e, direction) {
            var rate = direction === 'up'
                ? 1 / this.scaleInfos.scaleStep
                : this.scaleInfos.scaleStep;
            var nextWidth = this.viewInfos.width * rate;
            var nextHeight = this.viewInfos.height * rate;
            var scale = nextWidth / this.viewInfos.initWidth;
            this._setViewInfos('scale', scale);
            this._setViewInfos('width', nextWidth);
            this._setViewInfos('height', nextHeight);
            this._update();
        };
        ImageCanvas.prototype._handleMouseWheel = function (e, direction) {
            this._imageScale(e, direction);
        };
        ImageCanvas.prototype._handleMouseDown = function (e) {
            this.mouseMoveInfos.startX = e.x;
            this.mouseMoveInfos.startY = e.y;
            this.mouseMoveInfos.preX = this.viewInfos.x;
            this.mouseMoveInfos.preY = this.viewInfos.y;
        };
        ImageCanvas.prototype._handleMouseMove = function (e) {
            var offsetX = -(this.mouseMoveInfos.startX - e.x);
            var offsetY = -(this.mouseMoveInfos.startY - e.y);
            this._imageMove(e, offsetX, offsetY);
        };
        ImageCanvas.prototype._handleMouseUp = function (e) { };
        ImageCanvas.prototype._setViewInfos = function (key, value) {
            this.viewInfos[key] = value;
        };
        ImageCanvas.prototype._update = function () {
            this.clear();
            this.ctx.drawImage(this.imageInfos.image, this.viewInfos.x, this.viewInfos.y, this.viewInfos.width, this.viewInfos.height);
        };
        return ImageCanvas;
    }(Canvas));

    var MarkCanvas = /** @class */ (function (_super) {
        __extends(MarkCanvas, _super);
        function MarkCanvas(dom, image, config) {
            var _this = _super.call(this, dom) || this;
            _this.image = image;
            _this.viewInfos = _this.image.viewInfos;
            _this.showStore = [];
            _this.config = {
                drawType: 'rect',
                styles: __assign({ width: '2', color: '#f5222d', shadow: '#2b2b2b 5 2 2' }, config),
                scaleMax: 5,
                scaleMin: 0.2,
                scaleStep: 0.8,
            };
            _this.drawInfos = {
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
                clear: function () {
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
            _this.shiftInfos = {
                startShiftX: 0,
                startShiftY: 0,
                tempStore: [],
                clear: function () {
                    this.startShiftX = 0;
                    this.startShiftY = 0;
                    this.tempStore = [];
                },
            };
            _this.status = {
                mouseDownShift: false,
                mouseDownDraw: false,
                mouseDownDuring: false,
                ctrlDown: false,
            };
            _this.bindStatus = {
                scaleBind: false,
                shiftBind: false,
                drawBind: false,
                keyboardBind: false,
            };
            _this.handler = {
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
            return _this;
        }
        MarkCanvas.prototype.init = function () {
            this.mountEvents();
            this.bindEvents();
            this.setConfigStyle();
        };
        MarkCanvas.prototype.reloadImage = function (paths) {
            this.showStore = paths;
        };
        MarkCanvas.prototype.setDrawType = function (type) {
            this.config.drawType = type;
        };
        MarkCanvas.prototype.setConfigStyle = function (config) {
            var _this = this;
            var styles = config || this.config.styles;
            Object.keys(styles).forEach(function (key) {
                styles[key] && _this.setLineStyle(key, styles[key]);
            });
        };
        MarkCanvas.prototype.drawPolygonStart = function (e) {
            var x = this.removeFrameX(e.clientX);
            var y = this.removeFrameY(e.clientY);
            if (!this.drawInfos.path.points.length) {
                this.drawInfos.path = this.getPolygonPath([], [x, y]);
            }
            else {
                this.drawInfos.path.points.push([x, y]);
            }
        };
        MarkCanvas.prototype.drawPolygonMove = function (e) {
            var nextX = this.removeFrameX(e.clientX);
            var nextY = this.removeFrameY(e.clientY);
            var flagX = this.isOutsideViewX(e);
            var flagY = this.isOutsideViewY(e);
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
            var path = this.getPolygonPath(this.drawInfos.path.points, [nextX, nextY]);
            this.clear();
            this.drawPath(path);
            this.drawOldPath();
        };
        MarkCanvas.prototype.drawPolygonEnd = function (e) { };
        MarkCanvas.prototype.drawRectStart = function (e) {
            this.drawInfos.startDrawX = this.removeFrameX(e.clientX);
            this.drawInfos.startDrawY = this.removeFrameY(e.clientY);
        };
        MarkCanvas.prototype.drawRectMove = function (e) {
            var width = this.removeFrameX(e.clientX) - this.drawInfos.startDrawX;
            var height = this.removeFrameY(e.clientY) - this.drawInfos.startDrawY;
            var flagX = this.isOutsideViewX(e);
            var flagY = this.isOutsideViewY(e);
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
            this.drawInfos.path = this.getRectPath(this.drawInfos.startDrawX, this.drawInfos.startDrawY, width, height);
            this.clear();
            this.drawPath(this.drawInfos.path);
            this.drawOldPath();
        };
        MarkCanvas.prototype.drawRectEnd = function (e) {
            this.saveStore();
        };
        MarkCanvas.prototype.shiftStart = function (e) {
            this.shiftInfos.startShiftX = this.removeFrameX(e.clientX);
            this.shiftInfos.startShiftY = this.removeFrameY(e.clientY);
        };
        MarkCanvas.prototype.shiftMove = function (e) {
            var _this = this;
            var offsetX = this.removeFrameX(e.clientX) - this.shiftInfos.startShiftX;
            var offsetY = this.removeFrameY(e.clientY) - this.shiftInfos.startShiftY;
            this.shiftInfos.tempStore = this.showStore.map(function (path) { return (__assign(__assign({}, path), { points: path.points.map(function (point) { return [
                    point[0] + offsetX,
                    point[1] + offsetY,
                ]; }) })); });
            this.clear();
            this.shiftInfos.tempStore.forEach(function (path) { return _this.drawPath(path); });
        };
        MarkCanvas.prototype.shiftEnd = function (e) {
            this.showStore = this.shiftInfos.tempStore;
            this.shiftInfos.clear();
        };
        MarkCanvas.prototype.scaleDraw = function (e, direction) {
            var _this = this;
            var rate = direction === 'up' ? 1 / this.config.scaleStep : this.config.scaleStep;
            var tempStore = this.showStore.map(function (path) { return (__assign(__assign({}, path), { points: path.points.map(function (point) { return [
                    // 稍微解释一下，这个地方因为画的框是以 draw 层画布最左上角为基础的
                    // 但是我们要的是以 view 层最左上角（以后希望改成鼠标焦点缩放）为零点缩放
                    point[0] * rate - (rate - 1) * _this.viewInfos.x,
                    point[1] * rate - (rate - 1) * _this.viewInfos.y,
                ]; }) })); });
            this.clear();
            tempStore.forEach(function (path) { return _this.drawPath(path); });
            this.showStore = tempStore;
        };
        MarkCanvas.prototype.rollbackPath = function () {
            this.showStore.splice(this.showStore.length - 1, 1);
            this.clear();
            this.drawOldPath();
        };
        MarkCanvas.prototype.handleMouseWheel = function (e) {
            var direction = e.deltaY < 0 ? 'up' : 'down';
            EventStore$1.emit('mousewheel', e, direction);
            EventStore$1.emit('sacle', e, direction);
            this.scaleDraw(e, direction);
        };
        MarkCanvas.prototype.handleConetextMenu = function (e) {
            e.preventDefault();
            if (this.status.mouseDownDuring) {
                this.saveStore();
                this.status.mouseDownDuring = false;
            }
        };
        MarkCanvas.prototype.handleMouseDownShift = function (e) {
            this.status.mouseDownShift = true;
            EventStore$1.emit('mousedown', e);
            EventStore$1.emit('willShift', e);
            this.shiftStart(e);
        };
        MarkCanvas.prototype.handleMouseMoveShift = function (e) {
            if (this.status.mouseDownShift) {
                EventStore$1.emit('mousemove', e);
                EventStore$1.emit('shifting', e);
                this.shiftMove(e);
            }
        };
        MarkCanvas.prototype.handleMouseUpShift = function (e) {
            this.status.mouseDownShift = false;
            EventStore$1.emit('mouseup', e);
            EventStore$1.emit('shifted', e);
            this.shiftEnd(e);
        };
        MarkCanvas.prototype.handleMouseDownDraw = function (e) {
            if (e.button === 0) {
                if (this.isOutsizeView(e))
                    return;
                this.status.mouseDownDraw = true;
                EventStore$1.emit('willDraw', e);
                if (this.config.drawType === 'rect') {
                    this.drawRectStart(e);
                }
                if (this.config.drawType === 'polygon') {
                    // 当鼠标左键被按下
                    this.status.mouseDownDuring = true;
                    this.drawPolygonStart(e);
                }
            }
        };
        MarkCanvas.prototype.handleMouseMoveDraw = function (e) {
            EventStore$1.emit('drawing', e);
            if (this.status.mouseDownDuring) {
                if (this.drawInfos.path.points.length &&
                    this.config.drawType === 'polygon') {
                    this.drawPolygonMove(e);
                }
            }
            if (this.status.mouseDownDraw) {
                if (this.config.drawType === 'rect') {
                    this.drawRectMove(e);
                }
            }
        };
        MarkCanvas.prototype.handleMouseUpDraw = function (e) {
            EventStore$1.emit('drawn', e);
            if (this.config.drawType === 'rect') {
                this.drawRectEnd(e);
            }
            if (this.config.drawType === 'polygon') {
                this.drawPolygonEnd(e);
            }
            this.status.mouseDownDraw = false;
        };
        MarkCanvas.prototype.handleKeyDown = function (e) {
            if (this.status.mouseDownDraw || this.status.mouseDownDuring)
                return;
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
        };
        MarkCanvas.prototype.handleKeyUp = function (e) {
            if (e.keyCode === 32 && this.bindStatus.shiftBind) {
                if (this.status.mouseDownShift)
                    return;
                this.unBindShiftEvents();
                this.bindDrawEvents();
            }
            if (e.keyCode === 17 && this.bindStatus.scaleBind) {
                this.unBindScaleEvents();
            }
        };
        MarkCanvas.prototype.handleKeyPress = function (e) {
            if (e.keyCode === 113) {
                this.config.drawType =
                    this.config.drawType === 'rect' ? 'polygon' : 'rect';
            }
        };
        MarkCanvas.prototype.getRectPath = function (x, y, width, height) {
            // 所有的图形都遵照顺时针方向标注 point 点
            return {
                pathKey: "type-rect-" + Number(new Date()),
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
        };
        MarkCanvas.prototype.getPolygonPath = function (prePoints, nextPoint) {
            // 所有的图形都遵照顺时针方向标注 point 点
            return {
                pathKey: "type-polygon-" + Number(new Date()),
                type: 'polygon',
                styles: {
                    width: this.config.styles.width,
                    color: this.config.styles.color,
                    shadow: this.config.styles.shadow,
                },
                points: __spreadArrays(prePoints, [nextPoint]),
            };
        };
        MarkCanvas.prototype.drawPath = function (paths) {
            var _this = this;
            var type = paths.type, styles = paths.styles, points = paths.points;
            this.setConfigStyle(styles);
            var tempPoints = points.slice();
            var startPoint = tempPoints.splice(0, 1)[0];
            this.ctx.beginPath();
            this.ctx.moveTo.apply(this.ctx, startPoint);
            tempPoints.forEach(function (path) { return _this.ctx.lineTo.apply(_this.ctx, path); });
            this.ctx.closePath();
            this.ctx.stroke();
            this.setConfigStyle();
        };
        MarkCanvas.prototype.drawOldPath = function () {
            var _this = this;
            this.showStore.forEach(function (paths) { return _this.drawPath(paths); });
        };
        MarkCanvas.prototype.saveStore = function () {
            if (this.drawInfos.path.points.length) {
                EventStore$1.emit('addPath', this.drawInfos.path);
                this.showStore.push(this.drawInfos.path);
                this.drawInfos.clear();
            }
            this.clear();
            this.drawOldPath();
        };
        MarkCanvas.prototype.getRelativeImagePaths = function () {
            var _this = this;
            // 最终会当成 json 数据返回的 store，里面的路径都是相对底图，view 层
            // 简单来说下面的 showStore 是以 canvas 的最左上侧为 (0,0)
            // 而 store 是以 view 层的最左上角为 (0,0) 的
            // 所以说当图片缩放以及移动该 store 都不会变
            // 只有在改变了图形的形状，或者删除某些线的时候会变化
            // showStore 是专门展示给界面看的，所以说当图片缩放以及移动的时候
            return this.showStore.map(function (path) { return (__assign(__assign({}, path), { points: path.points.map(function (points) { return [
                    (points[0] - _this.viewInfos.x) / _this.viewInfos.scale,
                    (points[1] - _this.viewInfos.y) / _this.viewInfos.scale,
                ]; }) })); });
        };
        MarkCanvas.prototype.setLineStyle = function (key, value) {
            var _value = value.toString().replace(/px/g, '');
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            var that = this;
            var map = {
                width: function (_value) {
                    that.ctx['lineWidth'] = _value;
                },
                color: function (_value) {
                    that.ctx['strokeStyle'] = _value;
                },
                shadow: function (value) {
                    // black 1px 1px 1px
                    // shadowColor shadowBlur shadowOffsetX shadowOffsetY
                    var arr = _value.split(' ');
                    if (arr.length && arr.length === 3) {
                        that.ctx['shadowColor'] = arr[0];
                        that.ctx['shadowOffsetX'] = arr[1];
                        that.ctx['shadowOffsetY'] = arr[2];
                    }
                    if (arr.length && arr.length === 4) {
                        that.ctx['shadowColor'] = arr[0];
                        that.ctx['shadowBlur'] = arr[1];
                        that.ctx['shadowOffsetX'] = arr[2];
                        that.ctx['shadowOffsetY'] = arr[3];
                    }
                },
            };
            map[key](_value);
        };
        MarkCanvas.prototype.removeFrameX = function (num) {
            // 因为 canvas 最左上角相对屏幕仍有一些距离，某些时候
            // 比如获取的是 MouseEvent 的 clientX 的时候
            // 我们要的是相对 canvas 的 clientX，所以需要减去 canvas 相对屏幕的那些距离
            return num - this.canvasInfos.realScreenX;
        };
        MarkCanvas.prototype.removeFrameY = function (num) {
            return num - this.canvasInfos.realScreenY;
        };
        MarkCanvas.prototype.isOutsideViewX = function (e) {
            var realX = this.removeFrameX(e.clientX);
            if (realX < this.viewInfos.x)
                return 'left';
            if (realX > this.viewInfos.x + this.viewInfos.width)
                return 'right';
            return false;
        };
        MarkCanvas.prototype.isOutsideViewY = function (e) {
            var realY = this.removeFrameY(e.clientY);
            if (realY < this.viewInfos.y)
                return 'top';
            if (realY > this.viewInfos.y + this.viewInfos.height)
                return 'bottom';
            return false;
        };
        MarkCanvas.prototype.isOutsizeView = function (e) {
            return !!(this.isOutsideViewX(e) || this.isOutsideViewY(e));
        };
        MarkCanvas.prototype.bindScaleEvents = function () {
            this.ca.addEventListener('mousewheel', this.handler.handleMouseWheel);
            this.bindStatus.scaleBind = true;
        };
        MarkCanvas.prototype.unBindScaleEvents = function () {
            this.ca.removeEventListener('mousewheel', this.handler.handleMouseWheel);
            this.bindStatus.scaleBind = false;
        };
        MarkCanvas.prototype.bindShiftEvents = function () {
            this.ca.addEventListener('mousedown', this.handler.handleMouseDownShift);
            this.ca.addEventListener('mousemove', this.handler.handleMouseMoveShift);
            this.ca.addEventListener('mouseup', this.handler.handleMouseUpShift);
            this.bindStatus.shiftBind = true;
        };
        MarkCanvas.prototype.unBindShiftEvents = function () {
            this.ca.removeEventListener('mousedown', this.handler.handleMouseDownShift);
            this.ca.removeEventListener('mousemove', this.handler.handleMouseMoveShift);
            this.ca.removeEventListener('mouseup', this.handler.handleMouseUpShift);
            this.bindStatus.shiftBind = false;
        };
        MarkCanvas.prototype.bindDrawEvents = function () {
            this.ca.addEventListener('mousedown', this.handler.handleMouseDownDraw);
            this.ca.addEventListener('contextmenu', this.handler.handleConetextMenu);
            this.ca.addEventListener('mousemove', this.handler.handleMouseMoveDraw);
            this.ca.addEventListener('mouseup', this.handler.handleMouseUpDraw);
            this.bindStatus.drawBind = true;
        };
        MarkCanvas.prototype.unBindDrawEvents = function () {
            this.ca.removeEventListener('mousedown', this.handler.handleMouseDownDraw);
            this.ca.removeEventListener('contextmenu', this.handler.handleConetextMenu);
            this.ca.removeEventListener('mousemove', this.handler.handleMouseMoveDraw);
            this.ca.removeEventListener('mouseup', this.handler.handleMouseUpDraw);
            this.bindStatus.drawBind = false;
        };
        MarkCanvas.prototype.bindKeyboardEvents = function () {
            window.addEventListener('keydown', this.handler.handleKeyDown);
            window.addEventListener('keyup', this.handler.handleKeyUp);
            window.addEventListener('keypress', this.handler.handleKeyPress);
            this.bindStatus.keyboardBind = true;
        };
        MarkCanvas.prototype.unBindKeyboardEvents = function () {
            window.removeEventListener('keydown', this.handler.handleKeyDown);
            window.removeEventListener('keyup', this.handler.handleKeyUp);
            window.removeEventListener('keypress', this.handler.handleKeyPress);
            this.bindStatus.keyboardBind = false;
        };
        MarkCanvas.prototype.mountEvents = function () {
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
        };
        MarkCanvas.prototype.bindEvents = function () {
            this.bindDrawEvents();
            this.bindKeyboardEvents();
        };
        MarkCanvas.prototype.unBindEvents = function () {
            this.unBindShiftEvents();
            this.unBindDrawEvents();
            this.unBindScaleEvents();
            this.unBindKeyboardEvents();
        };
        MarkCanvas.prototype.destroy = function () {
            this.unBindEvents();
            EventStore$1.removeAll();
        };
        return MarkCanvas;
    }(Canvas));
    // 有个想法，事件绑定相关的东西，是不是还有很多地方可以改善
    // 比如切换 drawType 的时候，比如鼠标点击的时候，这样就不用在点击函数里面判断类型了

    function getPositionCanvas() {
        var canvas = document.createElement('canvas');
        canvas.style.cssText = ';width:100%;height:100%;position:absolute;';
        canvas.innerText =
            '哦豁，你的浏览器好像不支持 canvas，使用 chrome 浏览器食用最佳';
        return canvas;
    }
    function getHtmlDiv(htmlDiv) {
        var div;
        if (typeof htmlDiv === 'string') {
            div = document.getElementById(htmlDiv);
            if (!div)
                throw new Error('未找到画布容器');
        }
        else {
            div = htmlDiv;
        }
        return div;
    }

    /**
     * @todo resize，当 window 窗口变化的时候，canvas 画布内容并未随着变化
     * @todo 发现存在滚动条的时候，滚动滚动条也会导致画图位置不正确
     *
     * @todo 现在是这么样的想法，初始化的时候要给一个 url，表示初始的画布，另外还要给一个 loadImage 方法，重设画布
     * @todo 然后设置
     */
    var ImageMarker = /** @class */ (function (_super) {
        __extends(ImageMarker, _super);
        function ImageMarker(config) {
            var _this = _super.call(this) || this;
            _this.config = config;
            _this.hooks = config.hooks || {};
            return _this;
        }
        ImageMarker.prototype.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var config, parent, _a, parentRef, imageCanvasRef, drawCanvasRef, _b, imageCa, drawCa;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            config = this.config;
                            parent = config.parent;
                            _a = this._initContainer(parent), parentRef = _a[0], imageCanvasRef = _a[1], drawCanvasRef = _a[2];
                            return [4 /*yield*/, this._initInstance(config, imageCanvasRef, drawCanvasRef)];
                        case 1:
                            _b = _c.sent(), imageCa = _b[0], drawCa = _b[1];
                            this.parent = parentRef;
                            this.imageCa = imageCa;
                            this.drawCa = drawCa;
                            this._mountEvents();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * 设置当前的画笔状态
         * @param drawType 可传入 rect 和 polygon，代表矩形和多边形
         * @param width 当前画笔宽度
         * @param color 当前画笔颜色
         * @param shadow 当前画笔阴影
         */
        ImageMarker.prototype.setDrawStyle = function (_a) {
            var drawType = _a.drawType, width = _a.width, color = _a.color, shadow = _a.shadow;
            drawType && this.drawCa.setDrawType(drawType);
            (width || color || shadow) &&
                this.drawCa.setConfigStyle({ width: width, color: color, shadow: shadow });
        };
        /**
         * 设置某一条已经绘制的 path 的样式
         * @param key 创建 path 的时候唯一 key
         * @returns 返回被设置的那条 path，如果未设置成功则返回 false
         */
        ImageMarker.prototype.setPathStyle = function (key, _a) {
            var width = _a.width, color = _a.color, shadow = _a.shadow;
            var curr = this.drawCa.showStore.find(function (path) { return path.pathKey === key; });
            if (curr) {
                width && (curr.styles.width = width);
                color && (curr.styles.color = color);
                shadow && (curr.styles.shadow = shadow);
                this.drawCa.clear();
                this.drawCa.drawOldPath();
                return curr;
            }
            return false;
        };
        /**
         * 删除某一条已经绘制的 path
         * @param key 创建 path 的时候唯一 key
         * @returns 返回被删除的那条 path，如果未删除成功则返回 false
         */
        ImageMarker.prototype.removePath = function (key) {
            var curr = this.drawCa.showStore.find(function (path) { return path.pathKey === key; });
            if (curr) {
                this.drawCa.showStore = this.drawCa.showStore.filter(function (path) { return path.pathKey !== key; });
                this.drawCa.clear();
                this.drawCa.drawOldPath();
                return curr;
            }
            return false;
        };
        /**
         * 选择（高亮）某一条已经绘制的 path
         * @param key 创建 path 的时候唯一 key
         * @returns 返回该 key 所对应的 path，若未找到则返回 null
         */
        ImageMarker.prototype.selectPath = function (key) { };
        /**
         * 重新计算当前的 image 层和 draw 层的高度，一般用在改变了 canvas 的实际高度的时候
         * 比如改变了 windows 的大小的时候，就需要调用该方法，该方法会重新计算 image 层的高度
         * 然后将已有的 paths 重新绘制
         */
        ImageMarker.prototype.resize = function () {
            // let tempPath = this.draw.showStore;
            // this.image.resize();
            // this.draw.resize();
            // this.image.reloadImage().then(() => {
            //   this.draw.clear();
            //   this.draw.reloadImage(tempPath);
            //   this.draw.drawOldPath();
            // });
        };
        /**
         * 返回当前的所有 paths
         */
        ImageMarker.prototype.getAllPaths = function () {
            return this.drawCa.getRelativeImagePaths();
        };
        /**
         * 直接对当前图片导入 paths，会重置当前的 image 层移动和缩放状态
         * @param paths 符合格式的 paths
         */
        ImageMarker.prototype.importPaths = function (paths) {
            // 导入的时候会重置已经移动或者缩放过的 image 层，后续可以做成先缓存当前的缩放和移动状态
            // 导入成功之后再重新恢复这个缩放和移动的状态
        };
        /**
         * 更改当前的 image 层并清除 draw 层所有路径
         * @param url 导入的图片信息
         * @param paths 导入 paths 信息，也可以选择不导入，那就开始新的绘制
         */
        ImageMarker.prototype.importImage = function (url, paths) {
            var _this = this;
            this.imageCa.reloadImage(url).then(function () {
                _this.drawCa.clear();
                _this.drawCa.reloadImage(paths || []);
                _this.drawCa.drawOldPath();
            });
        };
        /**
         * 销毁当前创建的画布
         */
        ImageMarker.prototype.destroy = function () {
            this.imageCa && this.imageCa.destroy();
            this.drawCa && this.drawCa.destroy();
            this.parent.innerHTML = '';
        };
        ImageMarker.prototype._initContainer = function (parent) {
            var parentRef = getHtmlDiv(parent);
            var imageCanvasRef = getPositionCanvas();
            var drawCanvasRef = getPositionCanvas();
            parentRef.style.cssText += ';width:100%;height:100%;position:relative;';
            drawCanvasRef.style.zIndex = '10';
            parentRef.append(imageCanvasRef, drawCanvasRef);
            return [parentRef, imageCanvasRef, drawCanvasRef];
        };
        ImageMarker.prototype._initInstance = function (config, imageCanvasRef, drawCanvasRef) {
            return __awaiter(this, void 0, void 0, function () {
                var imageCa, drawCa;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            imageCa = new ImageCanvas(imageCanvasRef);
                            return [4 /*yield*/, imageCa.init(config.url)];
                        case 1:
                            _a.sent();
                            drawCa = new MarkCanvas(drawCanvasRef, imageCa, config.drawStyle || {});
                            drawCa.init();
                            return [2 /*return*/, [imageCa, drawCa]];
                    }
                });
            });
        };
        /**
         * 挂载用户自定义的 hooks
         */
        ImageMarker.prototype._mountEvents = function () {
            var hooks = this.hooks;
            hooks &&
                Object.keys(hooks).forEach(function (key) {
                    return EventStore$1.on(key, hooks[key]);
                });
        };
        return ImageMarker;
    }(Event));

    return ImageMarker;

}());
/* email: kimimi_king@163.com */
