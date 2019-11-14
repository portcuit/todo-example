const app = require('../')
global.subject$ = require('../main').ui(
  app.uiPort,
  app.ui,
  self)