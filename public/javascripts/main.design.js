export default class MainDesign {
  constructor () {
    this.colors = ['red', 'purple', 'grey', 'green', 'orange']
    this.idcolor = Math.floor(Math.random() * (4 - 0 + 1)) + 0
    this.themeColor = this.colors[this.idcolor];
  }

  getThemeColor() {
    return this.themeColor;
  }
}