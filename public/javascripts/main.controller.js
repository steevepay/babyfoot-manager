
import MainDesign from './main.design.js';
import WS from './services/websocket.service.js';
import BabyfootController from './babyfoot/babyfoot.controller.js';
import TchatController from './tchat/tchat.controller.js';

/**
 * Instantiate Tchat and Babyfoot controllers class and initialise
 */
const design = new MainDesign();
const wss = new WS();

const bfc = new BabyfootController();
bfc.init(wss, design.getThemeColor());

const tchatc = new TchatController();
tchatc.init(wss, design.getThemeColor());

/**
 * Handle Websocket messages and redirect to specific functions (defined by message.action and wsActions).
 */
wss.socket.onmessage = event => {
  let message = JSON.parse(event.data);
  
  if (message.type === bfc.wsId && bfc.wsActions.includes(message.action)) {
    bfc[message.action](message.data)
  }

  if (message.type === tchatc.wsId && tchatc.wsActions.includes(message.action)) {
    tchatc[message.action](message.data);
  }
}

console.log("call main controller");
