const {compose,plug,source,sink} = require('@pkit/core')
const {direct,mapToSink} = require('@pkit/helper')

const options = {
  width: 1920,
  height: 1200,
  webPreferences: {
    nodeIntegration: true,
    nodeIntegrationInWorker: true
  }
}

exports.default = ({electron:curr, context:{main:context}}) =>
  compose(
    require('@pkit/electron').default(curr, context),
    plug(mapToSink(`file://${__dirname}/../static/electron.html`),
      source(curr.window), sink(curr.load)),
    plug(direct, source(curr.terminated), sink(context.terminated)),
    plug(mapToSink(options), source(curr.ready), sink(curr.open)))
