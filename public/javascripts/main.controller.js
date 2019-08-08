
import WS from './websocket.service.js'
import BabyfootController from './babyfoot.controller.js';

const ws = new WS();
const games = new BabyfootController(ws);
games.init();

ws.socket.onmessage = event => {
  // Handle message
  let message = JSON.parse(event.data);
  if (message.type === 'message-bf')
    if (message.action === 'addGame') {
      games.addCard(message.data)
    } else if (message.action === 'updateGame') {
      games.updateCard(message.data);
    } else if (message.action === 'deleteGame') {
      games.deleteCard(message.data);
    }
}