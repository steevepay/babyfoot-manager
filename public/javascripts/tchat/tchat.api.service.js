export default class TchatApiService {

  constructor() {
    this.url = '/api/v1/messages'
  }

  async getMessages(page, limit) {
    const res = await fetch(this.url + `?page=${page}&limit=${limit}`).then(res => res.json());
    return res; 
  }

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

  async deleteGame(idGame) {
    const res = await fetch(`${this.url}/${idGame}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());
    return res;
  }
}