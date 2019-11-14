const {apply,pipe,isNil,not,insert,__,length,propEq} = require('ramda')
const {map} = require('rxjs/operators')

exports.left = (source$, sink) =>
  source$.pipe(
    map(([items]) =>
      items
        .filter(pipe(isNil,not))
        .filter(propEq('completed', false))),
    map(pipe(length, insert(0,__,[]), apply(sink))))