const {apply,propEq,remove} = require('ramda')
const {of} = require('rxjs')
const {tap,filter,map,mergeMap,withLatestFrom,delay} = require('rxjs/operators')

exports.keyCode = keyCode =>
  (source$, sink) =>
    source$.pipe(
      filter(propEq(1, keyCode)),
      map(apply(sink)))

exports.add = (source$, sink, data$) =>
  source$.pipe(
    withLatestFrom(data$),
    map(([[,,value], [items]]) =>
      sink(value, items.length - 1)))