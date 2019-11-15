import {default as main} from '../main'
import {port, window as cuit} from '../'
Object.assign(window, {
  subject$: main(port, cuit, Worker)
});
