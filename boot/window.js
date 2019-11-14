const app = require('../')
module.exports = require('../main').default(
  app.port,
  app.default,
  Worker)