const {ui: main} = require('../main')
const {uiPort: port, ui: kit} = require('../')
global.subject$ = main(port, kit, self)
