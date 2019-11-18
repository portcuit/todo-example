import {default as main} from '../main'
import {port, window as cuit} from '../index'
Object.assign(window, {
  subject$: main(port, cuit, Worker)
});
