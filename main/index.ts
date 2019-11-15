import {apply} from 'ramda'
import {of} from 'rxjs'
import {tap,map,catchError} from 'rxjs/operators'
import {run} from '@pkit/core'

export default (port, main, ...args) =>
  run(port, main, args,
    stream$ =>
      stream$.pipe(
        tap(apply(console.log)),
        catchError(e => {
          console.error(e);
          return of();
        })))

export const ui = (port, main, parent) =>
  run(port, main, [parent],
    stream$ =>
      stream$.pipe(
        tap(apply(console.log)),
        catchError(e => {
          console.error(e);
          parent.postMessage(['error', e.message, e.stack]);
          return of()
        })));

export const electron = (port, hook, ...args) =>
  run(port, hook, args,
    stream$ =>
      stream$.pipe(
        tap(apply(console.log)),
    catchError(e => {
      console.error(e);
      return process.env.STAGE ?
        process.exit(-1) :
        of()
    })));
