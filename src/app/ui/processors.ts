import {apply,pipe,isNil,not,insert,__,length,propEq} from 'ramda'
import {map} from 'rxjs/operators'
import {plug} from '@pkit/core'

const _left = (source$, sink) =>
  source$.pipe(
    map(([items]) =>
      items
        .filter(pipe(isNil,not))
        .filter(propEq('completed', false))),
    map(pipe(length, insert(0,__,[]), apply(sink))));

export const left = (source, sink) =>
  plug(_left, source, sink);