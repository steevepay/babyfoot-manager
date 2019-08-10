
import MainDesign from './main.design.js';
import WS from './services/websocket.service.js';
import BabyfootController from './babyfoot/babyfoot.controller.js';
import TchatController from './tchat/tchat.controller.js';

const design = new MainDesign();
const wss = new WS();

const bfc = new BabyfootController(wss, design.getThemeColor());
bfc.init();

const tchatc = new TchatController(wss, design.getThemeColor());
tchatc.init();

wss.socket.onmessage = event => {
  let message = JSON.parse(event.data);
  
  if (message.type === bfc.wsId && bfc.wsActions.includes(message.action)) {
    bfc[message.action](message.data)
  }

  if (message.type === tchatc.wsId) {
    tchatc[message.action](message.data);
  }
}
