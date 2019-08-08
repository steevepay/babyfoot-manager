
import WS from './websocket.service.js'
import BabyfootController from './babyfoot.controller.js';

const wss = new WS();
const bfc = new BabyfootController(wss);
bfc.init();

wss.socket.onmessage = event => {
  let message = JSON.parse(event.data);
  
  if (message.type === bfc.wsTypeName && bfc.wsActions.includes(message.action)) {
    bfc[message.action](message.data)
  }
}