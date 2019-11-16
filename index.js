"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@pkit/core");
const helper_1 = require("@pkit/helper");
const worker = __importStar(require("@pkit/worker"));
const ui = __importStar(require("./ui"));
const action = __importStar(require("./action"));
const port_1 = require("@pkit/core/port");
const bridge = {
    vnode: null,
    ui: Object.assign(Object.assign({}, port_1.context), { reload: null }),
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
exports.uiPort = Object.assign(Object.assign({}, port_1.context), { worker: worker.port.child, ui: ui.port, bridge });
const _ui = (port, parent) => core_1.compose(worker.useChildWorker(port.worker, parent, port.bridge.vnode, port.bridge.ui.terminated), core_1.plug(helper_1.directSink, core_1.source(port.ui.view.vnode), core_1.sink(port.bridge.vnode)), core_1.plug(helper_1.directSink, core_1.source(port.bridge.ui.terminate), core_1.sink(port.bridge.ui.terminated)), action.ui(port.bridge.action, port.ui.state), ui.default(port, port.ui.state, port.ui.view, port.bridge.action));
exports.ui = _ui;
//# sourceMappingURL=index.js.map