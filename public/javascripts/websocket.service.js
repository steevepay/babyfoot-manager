export default class WebSockets {
  constructor () {
    const protocol = window.location.protocol.includes('https:') ? 'wss:' : 'ws:'
    this.socket = new WebSocket(`${protocol}//${window.location.host}`);

    this.socket.onerror = error => {
      console.log(`WebSocket error: ${error}`)
    }
  }

  getSocket() {
    return this.socket;
  }

  broadcast(type, action, data) {
    var message = {
      'type': type,
      'action': action,
      'data': data
    }
    // console.log(message);
    this.socket.send(JSON.stringify(message)); 
  }
}