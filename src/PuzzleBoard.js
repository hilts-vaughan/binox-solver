const Point = require('./Point');
const PuzzleSlice = require('./PuzzleSlice');

const ONE = '1';
const ZERO = '0';
const NOT_FILLED_IN = 'X';

class PuzzleBoard {
  constructor(buffer) {
    this.buffer = buffer || [];
  }

  static fromBoardBinaryString(binaryString) {
    // The format of the binary board string is a square set of {0, 1, X}} indiciating the state of each piece
    // These are all seperated by a newline character, \n, and that's all there is to the format

    const binaryStringLines = binaryString.split(/\n/);
    const heightOfBoard = binaryStringLines.length;
    const buffer = [];

    binaryStringLines.forEach(binaryStringLine => {
      // Push all the characters into the buffer for each line
      const rowLength = binaryStringLine.length;
      const binaryLine = Array.from(binaryStringLine);

      buffer.push(binaryLine);

      if (rowLength !== heightOfBoard) {
        throw new Error(
          'The board has to be squared, so you cannot pass in something that is not squared'
        );
      }

      const hasSomeIllegalCharacter = binaryLine.some(
        c => ![ONE, ZERO, NOT_FILLED_IN].includes(c)
      );

      if (hasSomeIllegalCharacter) {
        throw new Error(
          `The string provided ${binaryStringLine} has some invalid character. Check input before constructing a board`
        );
      }
    });

    return new PuzzleBoard(buffer);
  }

  /**
   * This returns a copies of the board with the point changed to the token.
   * A new copy is important since we want to ensure no underlying mutation happens
   * (ie: we want the board to remain immutable)
   *
   * @param {*Point} point The point you want changed on the actual board
   * @param {string} token The token you want to paint on the board.
   */
  withPointChangedTo(point, token) {
    // TODO: lol this is very slow, you might consider something a bit better than in the future
    const copy = JSON.parse(JSON.stringify(this.buffer));

    const x = point.getX();
    const y = point.getY();

    copy[x][y] = token;

    return new PuzzleBoard(copy);
  }

  getIndiciePairsThatAreNotFilledIn() {
    const pairs = [];

    for (let x = 0; x < this.buffer.length; x++) {
      const row = this.buffer[x];
      for (let y = 0; y < row.length; y++) {
        const element = row[y];

        if (element === NOT_FILLED_IN) {
          pairs.push(new Point(x, y));
        }
      }
    }

    return pairs;
  }

  getSlicesForPoint(point) {
    if (!point) {
      throw new Error('You require a point!');
    }

    const { x, y } = point;
    const slices = [];

    const getRowSlice = () => {
      const rowString = this.buffer[x].join('');
      return PuzzleSlice.fromBinaryString(rowString);
    };

    const getColSlice = () => {
      let stringBuffer = '';
      for (let index = 0; index < this.buffer.length; index++) {
        const currentRow = this.buffer[index];
        const currentElementFromRow = currentRow[y];
        stringBuffer += currentElementFromRow;
      }

      return PuzzleSlice.fromBinaryString(stringBuffer);
    };

    return [getRowSlice(), getColSlice()];
  }

  getLength() {
    return this.buffer.length;
  }
}

module.exports = PuzzleBoard;
