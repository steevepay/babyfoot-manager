export default class TchatDesign {

  constructor(colorTheme) {
    this.colorTheme = colorTheme;
    this.initClickTchat();
  }

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

  scrollTchatBottom() {
    var element = document.getElementById("list-messages-tchat");
    if (element) {
      element.scrollTop = element.scrollHeight - element.clientHeight;
    }
  }

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

    // var listcards = document.getElementById("container-list");
    // listcards.insertBefore(card, listcards.firstElementChild);
  }

  getFrom() {
    return document.getElementById("input-from").value;
  }

  getMessage() {
    return document.getElementById("input-message").value;
  }

  cleanMessage() {
    document.getElementById("input-message").value = '';
  }

  displaySomebodyWritingNotif(value) {
    document.getElementById('notif-writing').style.display = value ? 'block' : 'none';
  }

  displayErrorMissingInput(value, target) {
    let input = document.getElementById(`input-${target}`);
    if (value) {
      input.classList.add('input-error');
    } else {
      input.classList.remove('input-error');
    }

  }
}