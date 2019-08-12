/**
 * @description Websocket overload to manage communication between clients.
 *
 * @export
 * @class WebSockets
 */
export default class WebSockets {


  /**
   * Creates an instance of WebSockets. Initialise protocole and connect socket client.
   * @memberof WebSockets
   */
  constructor () {
    this.protocol = window.location.protocol.includes('https:') ? 'wss:' : 'ws:'
    this.autoReconnectInterval = 5 * 1000; //ms
    this.socket = null;
    this.connectSocket();
  }


  /**
   * @description Instantiate web socket client and connect. Handle callback methods on events (close/error). Try automatically to reconnect.
   *
   * @memberof WebSockets
   */
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
  
  
  /**
   * @description Reconnect method calling the connectSocket Method after a time interval.
   *
   * @memberof WebSockets
   */
  reconnect () {
    console.log(`WebSocketClient: retry in ${this.autoReconnectInterval}ms`);
    setTimeout(() => {
      console.log("WebSocketClient: reconnecting...");
      this.connectSocket();
    },this.autoReconnectInterval);
  }


  /**
   * @description Broadcast message to other websocket clients.
   *
   * @param {String} type Type of the broadcast to identify the sender and receiver.
   * @param {String} action Method to call on receive.
   * @param {String} data Parameters
   * @memberof WebSockets
   */
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