
/**
 * @description Define the color of the application.
 *
 * @export
 * @class MainDesign
 */
export default class MainDesign {

  /**
   * Creates an instance of MainDesign and initialise a random theme color.
   * @memberof MainDesign
   */
  constructor () {
    this.colors = ['red', 'purple', 'grey', 'green', 'orange']
    this.idcolor = Math.floor(Math.random() * (4 - 0 + 1)) + 0
    this.themeColor = this.colors[this.idcolor];
  }


  /**
   * @description Get the theme color.
   *
   * @returns String
   * @memberof MainDesign
   */
  getThemeColor() {
    return this.themeColor;
  }
}