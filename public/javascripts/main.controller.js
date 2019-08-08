
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

// window.scrollTo(0,document.querySelector("#list-messages-tchat").scrollHeight);
// function gotoBottom(id){
  var element = document.getElementById("list-messages-tchat");
  element.scrollTop = element.scrollHeight - element.clientHeight;
// }

  document.getElementById("header-tchat").addEventListener('click', () => {
    let tchat = document.getElementById("container-tchat");
    if (tchat.style.bottom == "0px") {
      tchat.style.bottom = "-300px";
    } else {
      tchat.style.bottom = "0px";
    }
  }, false)