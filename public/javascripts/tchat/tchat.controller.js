import TchatDesign from './tchat.design.js'
import apiService from './tchat.api.service.js';
import WebSockets from '../services/websocket.service.js';


/**
 * @description Tchat controller to manage the states and logic of the tchat.
 *
 * @export
 * @class TchatController
 */
export default class TchatController {
  

  /**
   * Creates an instance of TchatController.
   * @param {WebSockets} ws Websockets instance.
   * @param {String} colorTheme Color of the global theme from the MainDesign Class
   * @memberof TchatController
   */
  constructor(ws, colorTheme) {
    /**
     * tdesign: manage/create/update/delete the tchat UI
     */
    this.tdesign = new TchatDesign(colorTheme);
    /**
     * apiS: Service to communicate with the API.
     */
    this.apiS = new apiService();
    /**
     * List of the messages fetched by apiS.
     * The source of truth that drives the tchat.
     */
    this.messages =  [];
    /**
     * Manage pagination when the tchat is scrolling to the top.
     */
    this.page = 0;
    this.limit = 10;
    this.fetchingMessages = false;
    /** 
     * Notification variables if somebody is writing 
     */
    this.receiveNotifWriting = true;
    this.sendNotifWriting = true;
    /** 
     * ws: Websockets instance is used to call the broadcast method on UI events (on click => broadcast).
     * wsId: Id of the class
     * wsActions: Function names that can be called upon new websocket message.
    */
    this.ws = ws;
    this.wsId = 'wb-message-tchat';
    this.wsActions = ['addMessage', 'notifSomebodyWriting'];
  }

  
  /**
   * @description Initialisation method to called after instanciate the class. Fetch the data and update the view.
   *
   * @memberof TchatController
   */
  async init() {
    await this.fetchMessages();
    this.initInputAddMessage();
    this.initScrollListener();
    this.tdesign.scrollTchatBottom()
  }


  /**
   * @description Fetch the tchat messages from the pagination variables (Page and limit). Then display the news messages.
   *
   * @returns true if the data fetched is empty or false the opposite.
   * @memberof TchatController
   */
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



  /**
   * @description Listen for scroll event. If scroll on the top, it fetch older messages. If the fetchMessage method return true, it stop fetch new messages.
   *
   * @memberof TchatController
   */
  initScrollListener() {
    let tchat = document.getElementById("list-messages-tchat");
    tchat.addEventListener('scroll', e => {
      if (tchat.scrollTop < 5 && !this.fetchingMessages) {
        this.fetchingMessages = true;
        this.fetchMessages().then(res => {
          this.fetchingMessages = res;
        })
      }
    }, false)
  }


  /**
   * @description Initialise listeners on the tchat input and prepare callbacks. If it press Return key (13), it check error on the input. Then it add on database then update the view with new message. Finally it broadcast a new message on websocket.
   * @description If the keyboard is typed, it broadcast "somebody is writing event" to the other websocket clients.
   *
   * @memberof TchatController
   */
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


  /**
   * @description Websocket action method called on new message event. It add a new message and update the view.
   *
   * @param {Object} msg Object message: {id: 0, name: 'john', message: 'Hey!', user: true/false actual user or not}
   * @memberof TchatController
   */
  addMessage(msg) {
    console.log(msg);
    this.messages.push(msg);
    this.tdesign.addMessage(msg.id, msg.name, msg.message, msg.user, 'bottom');
    this.tdesign.scrollTchatBottom();
  }


  /**
   * @description Websocket action method called on new message event. It display "somebody is writing" on the view. Timeout has been added to reduce the number of websocket events.
   *
   * @param {Object} data
   * @memberof TchatController
   */
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


  /**
   * @description Check inputs and update the view on errors. It check if username empty or the message field empty.
   *
   * @param {String} name name of the user typing the message
   * @param {String} text message
   * @returns
   * @memberof TchatController
   */
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