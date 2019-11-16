import {apply,pipe,isNil,not,insert,__,length,propEq} from 'ramda'
import {map} from 'rxjs/operators'

export const left = (source$, sink) =>
  source$.pipe(
    map(([items]) =>
      items
        .filter(pipe(isNil,not))
        .filter(propEq('completed', false))),
    map(pipe(length, insert(0,__,[]), apply(sink))));
