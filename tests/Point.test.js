const Point = require('../src/Point');

describe('Point', () => {
  it('getters working fine', () => {
    const point = new Point(12, 35);

    expect(point.getX()).toBe(12);
    expect(point.getY()).toBe(35);
  });

  it('should throw if someone tries to pass nothing in for the point constructor since it is required', () => {
    const shouldThrowSinceIllegalArguments = () => new Point();
    expect(shouldThrowSinceIllegalArguments).toThrow();
  });
});
