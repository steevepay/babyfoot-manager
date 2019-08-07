export default class BfApiService {
  constructor() {
    this.url = '/api/v1/games'
  }

  async getGames() {
    const res = await fetch(this.url).then(res => res.json());
    console.log(res)
    return res; 
  }

  async newGame(name) {
    const res = await fetch(this.url, {
      method: 'POST',
      body: JSON.stringify({
        name: name
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());
    console.log(res);
    return res;
  }

  async updateGame(idGame, status) {
    const res = await fetch(this.url + "/" + idGame, {
      method: 'PATCH',
      body: JSON.stringify({
        status: status
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());
    console.log(res);
    return res;
  }

  async deleteGame(idGame) {
    const res = await fetch(this.url + "/" + idGame, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());
    console.log(res);
    return res;
  }
}