import TchatDesign from './tchat.design.js'

// tdesign.scrollTchatBottom();
// tdesign.addMessage('Steeve', 'wow, ça marche vraiment trop bien !!!', true);

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
    document.getElementById('input-message').addEventListener('keypress', (e) => {
      if (e.keyCode === 13) {
        let name = this.tdesign.getFrom();
        let text = this.tdesign.getMessage();
        const msg = this.buildMessage(name, text, true)
        this.addMessage(msg);
        this.tdesign.cleanMessage();
        msg.user = false;
        this.ws.broadcast(this.wsId, 'addMessage', msg);
      } else if (this.sendNotifWriting){
        this.sendNotifWriting = false;
        this.ws.broadcast(this.wsId, 'notifSomebodyWriting', null);
        setTimeout(() => {
          this.sendNotifWriting = true;
        }, 2000);
      }
      // const format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
      // if (name === "" || format.test(name)) {
      //   this.bfdesign.showInputError();
      // } else {
      //   this.bfdesign.hideInputError();
      //   this.apiS.newGame(name).then((res) => {
      //     document.getElementById('input-game').value = '';
      //     let game = res[0];
      //     this.addCard(game)
      //     this.ws.broadcast(this.wsId, 'addCard', game);
      //   });
      // }
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
}