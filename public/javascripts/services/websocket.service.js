export default class WebSockets {
  constructor () {
    this.protocol = window.location.protocol.includes('https:') ? 'wss:' : 'ws:'
    this.autoReconnectInterval = 5 * 1000; //ms
    this.socket = null;
    this.connectSocket();
  }

  connectSocket() 
  {
    this.socket = new WebSocket(`${this.protocol}//${window.location.host}`);

    this.socket.onopen = () => {
      console.log('WebSocketClient: Connected!')
      console.log(this.socket.readyState);
    }
    
    this.socket.onerror = e => {
      console.log(`WebSocket error: ${e}`)
      this.socket.close();
      this.reconnect();
    }
    
    this.socket.onclose = e => {
      console.log(e);
      console.log("WebSocketClient: closed");
      this.reconnect();
    }
  }
  
  reconnect () {
    console.log(`WebSocketClient: retry in ${this.autoReconnectInterval}ms`);
    setTimeout(() => {
      console.log("WebSocketClient: reconnecting...");
      this.connectSocket();
    },this.autoReconnectInterval);
  }

  broadcast(type, action, data) {
    var message = {
      'type': type,
      'action': action,
      'data': data
    }
    try{
      this.socket.send(JSON.stringify(message));
    }catch (e){
      console.log(e);
    }
  }
}