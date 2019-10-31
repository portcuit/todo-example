const {prepare} = require('@pkit/core')

module.exports = prepare({
  context: {
    main: require('@pkit/core/port/context').raw,
  },
  electron: require('@pkit/electron/port').raw
})
