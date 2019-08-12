

/**
 * Manage and update the tchat view.
 *
 * @export
 * @class TchatDesign
 */
export default class TchatDesign {


  /**
   * Creates an instance of TchatDesign, initialise the color and click listeners.
   * @param {String} colorTheme
   * @memberof TchatDesign
   */
  constructor(colorTheme) {
    this.colorTheme = colorTheme;
    this.initClickTchat();
  }


  /**
   * @description Bind click event to open and close the tchat.
   *
   * @memberof TchatDesign
   */
  initClickTchat() {
    document.getElementById("header-tchat").addEventListener('click', () => {
      let tchat = document.getElementById("container-tchat");
      if (tchat.style.bottom == "0px") {
        tchat.style.bottom = "-300px";
      } else {
        tchat.style.bottom = "0px";
      }
    }, false)
  }


  /**
   * @description Scroll the tchat to the bottom.
   *
   * @memberof TchatDesign
   */
  scrollTchatBottom() {
    var element = document.getElementById("list-messages-tchat");
    if (element) {
      element.scrollTop = element.scrollHeight - element.clientHeight;
    }
  }


  /**
   * @description Create an new message on the tchat UI.
   *
   * @param {Number} id // id
   * @param {String} name // User name
   * @param {String} message // Message
   * @param {Boolean} user // True of false - display the message of sender or receiver.
   * @param {String} msgPosition // top or bottom - Add the message on the top of bottom of the tchat.
   * @memberof TchatDesign
   */
  addMessage(id, name, message, user, msgPosition) {
    let msgbox = document.createElement("div"); 
    msgbox.id = `msg-${id}`;
    msgbox.classList.add("msg");
    if (user) {
      msgbox.classList.add("msg-user");
      msgbox.classList.add(`bg-light-${this.colorTheme}`);
    }

    let from = document.createElement("div"); 
    from.classList.add("from");
    from.innerHTML = `${name}`

    let msg = document.createElement("div"); 
    msg.innerHTML = message;

    msgbox.appendChild(from);
    msgbox.appendChild(msg);

    let tchat = document.getElementById('list-messages-tchat');
    if (msgPosition === 'top') {
      tchat.insertBefore(msgbox, tchat.firstElementChild);
    } else if (msgPosition === 'bottom') {
      tchat.appendChild(msgbox);
    }
  }


  /**
   * @description Return the username on the input.
   *
   * @returns String: The username 
   * @memberof TchatDesign
   */
  getFrom() {
    return document.getElementById("input-from").value;
  }


  /**
   * @description Return the message on the input.
   *
   * @returns String: the message.
   * @memberof TchatDesign
   */
  getMessage() {
    return document.getElementById("input-message").value;
  }


  /**
   * @description Clean the message value on the input.
   *
   * @memberof TchatDesign
   */
  cleanMessage() {
    document.getElementById("input-message").value = '';
  }


  /**
   * @description Print the message "somebody is writing on the view".
   *
   * @param {Boolean} value True/False to enable or disable the message.
   * @memberof TchatDesign
   */
  displaySomebodyWritingNotif(value) {
    document.getElementById('notif-writing').style.display = value ? 'block' : 'none';
  }


  /**
   * @description Add class to notify input errors
   *
   * @param {Boolean} value True or false
   * @param {String} target Values: 'from' or 'message'
   * @memberof TchatDesign
   */
  displayErrorMissingInput(value, target) {
    let input = document.getElementById(`input-${target}`);
    if (value) {
      input.classList.add('input-error');
    } else {
      input.classList.remove('input-error');
    }

  }
}