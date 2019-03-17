class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    if (this.x == null || !this.y == null) {
      throw new Error('A point requires a valid X and Y value.');
    }
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }
}

module.exports = Point;
