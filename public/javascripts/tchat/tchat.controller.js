import TchatDesign from './tchat.design.js'
import apiService from './tchat.api.service.js';

export default class TchatController {
  
  constructor(ws, colorTheme) {
    this.tdesign = new TchatDesign(colorTheme);
    this.apiS = new apiService();
    this.messages =  [];
    /** Manage message fetching */
    this.page = 0;
    this.limit = 10;
    this.fetchingMessages = false;

    /** Notification variables if somebody is writing */
    this.receiveNotifWriting = true;
    this.sendNotifWriting = true;
    /** Websockets */
    this.ws = ws;
    this.wsId = 'wb-message-tchat';
    this.wsActions = ['addMessage', 'notifSomebodyWriting'];
  }

  async init() {
    await this.fetchMessages();
    this.initInputAddMessage();
    this.initScrollListener();
    this.tdesign.scrollTchatBottom()
  }

  async fetchMessages() {
    this.page++;
    let newMessages = await this.apiS.getMessages(this.page, this.limit);
    if (newMessages.length === 0) 
      return true;
    newMessages.forEach(x => {
      this.tdesign.addMessage(x.id, x.name, x.message, false, 'top');
    })
    this.messages.push(...newMessages);
    return false;
  }

  initScrollListener() {
    let tchat = document.getElementById("list-messages-tchat");
    tchat.addEventListener('scroll', e => {
      // console.log(tchat.scrollTop);
      if (tchat.scrollTop < 5 && !this.fetchingMessages) {
        this.fetchingMessages = true;
        this.fetchMessages().then(res => {
          this.fetchingMessages = res;
        })
        // await = this.apiS.getMessages(this.page, this.limit);
        // console.log('fetch');
      }
    }, false)
  }

  initInputAddMessage() {
    const input = document.getElementById('input-message');
    input.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        let name = this.tdesign.getFrom();
        let text = this.tdesign.getMessage();
        if (this.checkInputsErrors(name, text)) {
          this.apiS.newMessage(name, text).then(res => {
            let msg = res[0];
            msg['user'] = true;
            this.addMessage(msg);
            this.tdesign.cleanMessage();
            this.tdesign.scrollTchatBottom()
            msg.user = false;
            this.ws.broadcast(this.wsId, 'addMessage', msg);
          }); 
        }
      } else if (this.sendNotifWriting){
        this.sendNotifWriting = false;
        this.ws.broadcast(this.wsId, 'notifSomebodyWriting', null);
        setTimeout(() => {
          this.sendNotifWriting = true;
        }, 2000);
      }
    }, false);
  }

  addMessage(msg) {
    console.log(msg);
    this.messages.push(msg);
    this.tdesign.addMessage(msg.id, msg.name, msg.message, msg.user, 'bottom');
    this.tdesign.scrollTchatBottom();
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