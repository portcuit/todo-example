const {__,pipe,assoc,curryN} = require('ramda')
require('./inspect')
reload('./src/server/main').then(pipe(assoc('events$', __, {}), curryN(2,Object.assign)(global)))
