
import ColorTheme from './colortheme.design.js';
import WS from './websocket.service.js';
import BabyfootController from './babyfoot.controller.js';
import TchatController from './tchat.controller.js';

const theme = new ColorTheme();
const wss = new WS();

const bfc = new BabyfootController(wss, theme.getThemeColor());
bfc.init();

const tchatc = new TchatController(wss, theme.getThemeColor());
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
