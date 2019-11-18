import {apply,propEq} from 'ramda'
import {tap,filter,map,withLatestFrom} from 'rxjs/operators'
import {plug} from '@pkit/core'

const _keyCode = keyCode =>
  (source$, sink) =>
    source$.pipe(
      filter(propEq(1, keyCode)),
      map(apply(sink)));

export const keyCode = (source, sink, code) =>
  plug(_keyCode(code), source, sink);

const _add = (source$, sink, data$) =>
  source$.pipe(
    withLatestFrom(data$),
    map(([[,,value], [items]]) =>
      sink(value, items.length - 1)));

export const add = (source, sink, collection) =>
  plug(_add, source, sink, collection);
