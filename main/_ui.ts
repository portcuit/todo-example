import {ui as main} from '../main'
import {uiPort as port, uiKit as cuit} from '../'
Object.assign(globalThis, {
  subject$: main(port, cuit, self)
});
