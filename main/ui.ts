import {ui as main} from '../main/index'
import {uiPort as port, ui as cuit} from '../'
Object.assign(globalThis, {
  subject$: main(port, cuit, self)
});
