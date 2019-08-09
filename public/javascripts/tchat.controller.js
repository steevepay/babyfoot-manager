import TchatDesign from './tchat.design.js'


export default class TchatController {
  
  constructor(ws) {
    this.tdesign = new TchatDesign();
    this.messages =  [];
    this.receiveNotifWriting = true;
    this.sendNotifWriting = true;
    /** Websockets */
    this.ws = ws;
    this.wsId = 'wb-message-tchat';
    this.wsActions = ['addMessage', 'notifSomebodyWriting'];
  }

  init() {
    this.initInputAddMessage();
    this.tdesign.scrollTchatBottom();
  }

  initInputAddMessage() {
    const input = document.getElementById('input-message');
    input.addEventListener('keypress', (e) => {
      if (e.keyCode === 13) {
        let name = this.tdesign.getFrom();
        let text = this.tdesign.getMessage();
        if (this.checkInputsErrors(name, text)) {
          const msg = this.buildMessage(name, text, true)
          this.addMessage(msg);
          this.tdesign.cleanMessage();
          msg.user = false;
          this.ws.broadcast(this.wsId, 'addMessage', msg);
        }
      }
    }, false);

    input.addEventListener('keyup', () => {
      console.log('lala');
      if (this.sendNotifWriting){
        this.sendNotifWriting = false;
        this.ws.broadcast(this.wsId, 'notifSomebodyWriting', null);
        setTimeout(() => {
          this.sendNotifWriting = true;
        }, 2000);
      }
    }, false);
  }

  buildMessage(name, text, user) {
    return {
      name: name,
      text: text,
      user: user
    };
  }

  addMessage (msg) {
    this.messages.push(msg);
    this.tdesign.addMessage(msg.name, msg.text, msg.user);
  }

  notifSomebodyWriting(data) {
    if (this.receiveNotifWriting) {
      this.receiveNotifWriting = false;
      this.tdesign.displaySomebodyWritingNotif(!this.receiveNotifWriting);
      setTimeout(() => {
        this.receiveNotifWriting = true;
        this.tdesign.displaySomebodyWritingNotif(!this.receiveNotifWriting);
      }, 2000);
    }
  }

  checkInputsErrors(name, text) {
    if (!name || name === '') {
      this.tdesign.displayErrorMissingInput(true, 'from');
      return false;
    } else if (!text || text === '') {
      this.tdesign.displayErrorMissingInput(false, 'from');
      this.tdesign.displayErrorMissingInput(true, 'message');
      return false;
    }
    this.tdesign.displayErrorMissingInput(false, 'from');
    this.tdesign.displayErrorMissingInput(false, 'message');
    return true;
  }
}