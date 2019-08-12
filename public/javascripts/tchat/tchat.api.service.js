
/**
 * Tchat Api Service making http requets and return the response.
 *
 * @export
 * @class TchatApiService
 */
export default class TchatApiService {


  /**
   * Creates an instance of TchatApiService.
   * @memberof TchatApiService
   */
  constructor() {
    this.url = '/api/v1/messages'
  }


  /**
   * @description Fetch the messages.
   *
   * @param {*} page Actual page of scrolling. Used to calculate the offset.
   * @param {*} limit Number of messages.
   * @returns Array of messages objects.
   * @memberof TchatApiService
   */
  async getMessages(page, limit) {
    const res = await fetch(this.url + `?page=${page}&limit=${limit}`).then(res => res.json());
    return res; 
  }


  /**
   * @description Create a new message and database.
   *
   * @param {*} name Name of the user.
   * @param {*} message New message
   * @returns Return the message object with an id: {id:0, name: '', message: ''}.
   * @memberof TchatApiService
   */
  async newMessage(name, message) {
    const res = await fetch(this.url, {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        message: message
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());
    return res;
  }
}