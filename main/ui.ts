const {ui: main} = require('../main')
const {uiPort: port, ui: cuit} = require('../')
global.subject$ = main(port, cuit, self)
