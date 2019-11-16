var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var _a = require('@pkit/core'), compose = _a.compose, plug = _a.plug, source = _a.source, sink = _a.sink;
var _b = require('@pkit/helper'), directSink = _b.directSink, fromEventSink = _b.fromEventSink, switchMapZipSink = _b.switchMapZipSink;
var worker = require('@pkit/worker');
var ui = require('./ui');
var action = require('./action');
var snabbdom = require('@pkit/snabbdom');
var context = require('@pkit/core/port').context;
var bridge = {
    vnode: null,
    ui: __assign(__assign({}, context), { reload: null }),
    action: action.port
};
exports.port = __assign(__assign({}, context), { snabbdom: snabbdom.port, worker: worker.port.parent, bridge: bridge });
exports.window = function (port, Worker) {
    var EventEmitter = require('events').EventEmitter;
    var _a = require('@pkit/snabbdom'), defaultModules = _a.defaultModules, createActionModule = _a.action;
    var emitter = new EventEmitter;
    var actionModule = createActionModule(emitter, 'action');
    var injectGlobal = require('emotion').injectGlobal;
    injectGlobal(__makeTemplateObject(["\n@import url(\"https://unpkg.com/todomvc-app-css@2.3.0/index.css\");\n"], ["\n@import url(\"https://unpkg.com/todomvc-app-css@2.3.0/index.css\");\n"]));
    return compose(worker.useParentWorker.apply(worker, __spreadArrays([port.worker, port, Worker,
        __dirname + "/main/_ui.js"], (function (action) { return [
        action.newTodo.enter,
        action.item.completed.change,
        action.item.destroy.click,
        action.item.title.dblclick,
        action.item.edit.enter,
        action.item.edit.esc,
    ]; })(port.bridge.action), [port.bridge.ui.terminate])), plug(fromEventSink(emitter, 'action')), action.default(port.bridge.action), snabbdom.default(port.snabbdom, port, document.body.children[0], __spreadArrays([actionModule], defaultModules)), plug(directSink, source(port.bridge.vnode), sink(port.snabbdom.render)), plug(directSink, source(port.terminate), sink(port.bridge.ui.terminate)), plug(switchMapZipSink, source(port.terminate), sink(port.quit), source(port.bridge.ui.terminated)));
};
exports.uiPort = __assign(__assign({}, context), { worker: worker.port.child, ui: ui.port, bridge: bridge });
exports.ui = function (port, parent) {
    return compose(worker.useChildWorker(port.worker, parent, port.bridge.vnode, port.bridge.ui.terminated), plug(directSink, source(port.ui.view.vnode), sink(port.bridge.vnode)), plug(directSink, source(port.bridge.ui.terminate), sink(port.bridge.ui.terminated)), action.ui(port.bridge.action, port.ui.state), ui.default(port, port.ui.state, port.ui.view, port.bridge.action));
};
