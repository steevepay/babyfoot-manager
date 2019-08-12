

/**
 * Babyfoot Api Service making http requets and return the response.
 *
 * @export
 * @class BfApiService
 */
export default class BfApiService {

  /**
   * Creates an instance of BfApiService.
   * @memberof BfApiService
   */
  constructor() {
    this.url = '/api/v1/games'
  }


  /**
   * @description Fetch the babyfoot games.
   *
   * @returns Arrays for objects (babyfoot games).
   * @memberof BfApiService
   */
  async getGames() {
    const res = await fetch(this.url).then(res => res.json());
    return res; 
  }


  /**
   * @description Create a new babyfoot game on database.
   *
   * @param {String} name Name of the new game, format: 'John vs Léo'
   * @returns Return the babyfoot game object with an id: {id:0, name:'', status:'progress'}.
   * @memberof BfApiService
   */
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
    return res;
  }


  /**
   * @description Update the game state of the game.
   *
   * @param {Number} idGame id of the babyfoot game.
   * @param {String} status Status of the game: done/progress
   * @returns Result of the request.
   * @memberof BfApiService
   */
  async updateGame(idGame, status) {
    const res = await fetch(`${this.url}/${idGame}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: status
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => response.json());
    return res;
  }


  /**
   * @description Delete the babyfoot game.
   *
   * @param {Number} idGame id of the babyfoot game.
   * @returns Result of the request.
   * @memberof BfApiService
   */
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