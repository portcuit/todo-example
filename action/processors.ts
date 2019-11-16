import {apply,propEq} from 'ramda'
import {tap,filter,map,withLatestFrom} from 'rxjs/operators'

export const keyCode = keyCode =>
  (source$, sink) =>
    source$.pipe(
      filter(propEq(1, keyCode)),
      map(apply(sink)));

export const add = (source$, sink, data$) =>
  source$.pipe(
    withLatestFrom(data$),
    map(([[,,value], [items]]) =>
      sink(value, items.length - 1)));
