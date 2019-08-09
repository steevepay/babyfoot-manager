export default class TchatDesign {

  constructor() {
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

  addMessage(name, message, user) {
    let msgbox = document.createElement("div"); 
    msgbox.classList.add("msg");
    if (user) {
      msgbox.classList.add("msg-user");
    }

    let from = document.createElement("div"); 
    from.classList.add("from");
    from.innerHTML = `${name}`

    let msg = document.createElement("div"); 
    msg.innerHTML = message;

    msgbox.appendChild(from);
    msgbox.appendChild(msg);

    let tchat = document.getElementById('list-messages-tchat');
    tchat.appendChild(msgbox);
    this.scrollTchatBottom();
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