const app = require('../')
global.subject$ = require('../main').ui(
  app.port,
  app.ui,
  self)