"use strict";
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@pkit/core");
var helper_1 = require("@pkit/helper");
var worker = __importStar(require("@pkit/worker"));
var ui = __importStar(require("./ui"));
var action = __importStar(require("./action"));
var port_1 = require("@pkit/core/port");
var bridge = {
    vnode: null,
    ui: __assign(__assign({}, port_1.context), { reload: null }),
    action: action.port
};
// exports.port = {
//   ...context,
//   snabbdom: snabbdom.port,
//   worker: worker.port.parent,
//   bridge
// };
//
// exports.window = (port, Worker) => {
//   const {EventEmitter} = require('events');
//   const {defaultModules, action: createActionModule} = require('@pkit/snabbdom');
//   const emitter = new EventEmitter;
//   const actionModule = createActionModule(emitter, 'action');
//   const {injectGlobal} = require('emotion');
//
//   injectGlobal`
// @import url("https://unpkg.com/todomvc-app-css@2.3.0/index.css");
// `
//   return compose(
//     worker.useParentWorker(port.worker, port, Worker,
//       `${__dirname}/main/_ui.js`,
//       ...(action => [
//         action.newTodo.enter,
//         action.item.completed.change,
//         action.item.destroy.click,
//         action.item.title.dblclick,
//         action.item.edit.enter,
//         action.item.edit.esc,
//       ])(port.bridge.action),
//       port.bridge.ui.terminate),
//     plug(fromEventSink(emitter, 'action')),
//     action.default(port.bridge.action),
//     snabbdom.default(port.snabbdom, port, document.body.children[0], [actionModule, ...defaultModules]),
//     plug(directSink,
//       source(port.bridge.vnode), sink(port.snabbdom.render)),
//     plug(directSink,
//       source(port.terminate), sink(port.bridge.ui.terminate)),
//     plug(switchMapZipSink,
//       source(port.terminate),
//       sink(port.quit),
//       source(port.bridge.ui.terminated)))
// };
exports.uiPort = __assign(__assign({}, port_1.context), { worker: worker.port.child, ui: ui.port, bridge: bridge });
var _ui = function (port, parent) {
    return core_1.compose(worker.useChildWorker(port.worker, parent, port.bridge.vnode, port.bridge.ui.terminated), core_1.plug(helper_1.directSink, core_1.source(port.ui.view.vnode), core_1.sink(port.bridge.vnode)), core_1.plug(helper_1.directSink, core_1.source(port.bridge.ui.terminate), core_1.sink(port.bridge.ui.terminated)), action.ui(port.bridge.action, port.ui.state), ui.default(port, port.ui.state, port.ui.view, port.bridge.action));
};
exports.ui = _ui;
//# sourceMappingURL=index.js.map