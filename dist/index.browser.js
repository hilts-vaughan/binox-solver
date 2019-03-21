(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.BinoxSolver = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
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

},{"./Point":1,"./PuzzleSlice":3}],3:[function(require,module,exports){
/*
  Represents some contigious slice of a Binoz puzzle. It provides some of the encoded rules within itself so
  you can validate individual slices as needed. 
*/
class PuzzleSlice {
  constructor(length) {
    this.buffer = [];
    this.length = length;

    if (this.length < 0 || this.length === 0) {
      throw new Error(
        'You can not provide a negative or zero length for a slice, since all slices have to be positive'
      );
    }
  }

  static fromBinaryString(binaryString) {
    const slice = new PuzzleSlice(binaryString.length);
    const charSet = Array.from(binaryString);

    const hasSomeIllegalCharacter = charSet.some(c => !['1', '0', 'X'].includes(c));
    if (hasSomeIllegalCharacter) {
      throw new Error(
        `You cannot parse the binary string ${binaryString} since it is not binary. Make sure the string is only 1s and 0s.`
      );
    }

    // It's legal, so we can assign it
    slice.buffer = charSet;

    return slice;
  }

  // interface
  get(index) {
    if (!this.has(index)) {
      throw new Error(
        'The indice at the slice is out of bounds. Are you sure you accessed something you know is correct?'
      );
    }

    return this.buffer[index];
  }

  has(index) {
    return this.buffer[index] !== undefined;
  }

  getLength() {
    return this.length;
  }

  isNotSlidingWindowLargerThanThree() {
    // For this one, we have to make sure there is never a streak of more than 3 of the same chars
    // We can just use a sliding window to check for this, grabbing the slices of the last 3 elements to do so
    const MAX_STREAK_RUN = 3;

    let startingIndex = 0;
    for (let index = 0; index < this.buffer.length - MAX_STREAK_RUN; index++) {
      // The filter is more or less to get rid of falsy values since streaks might be a thing
      // of two or so to ensure we are on the right track
      const bufferSlice = this.buffer.slice(index, index + MAX_STREAK_RUN);

      if (bufferSlice.includes('X')) {
        continue; // Slices w/ X are not needed to be compared
      }

      const intialSeed = bufferSlice[0];
      const isDigitsAllSame = bufferSlice.every(c => c === intialSeed);

      // If they're all the same, then it's a falure
      if (isDigitsAllSame) {
        return false;
      }
    }

    return true;
  }

  isExceedingQuota() {
    const maxQuota = Math.floor(this.getLength() / 2);

    let ones = 0;
    let zeroes = 0;

    for (let index = 0; index < this.getLength(); index++) {
      const element = this.buffer[index];
      if (element === '1') {
        ones++;
      } else if (element === '0') {
        zeroes++;
      }
    }

    return ones > maxQuota || zeroes > maxQuota;
  }

  isValidSlice() {
    // Checks if the slice is legal according to the rules specified in Binox
    // 2. Horizontally and vertically, there can be no more than 2 of the same symbol touching.
    // 3. There are an equal number of Xs and Os in each row and column.
    // We are going to implement two of the above rules here, and then we can figure out the rest
    // later in another validation step

    // NOTE: For speed reasons, you would be better off doing this in a single pass instead of two
    // seperate functions. However, I don't believe this will bottleneck so I'm leaving it here for
    // design reasons like this

    const isBalanced = () => {
      let ones = 0;
      let zeroes = 0;

      for (let index = 0; index < this.getLength(); index++) {
        const element = this.buffer[index];

        if (element === 'X') {
          continue;
        }

        element === '1' ? ones++ : zeroes++;
      }

      return zeroes === ones;
    };

    return this.isNotSlidingWindowLargerThanThree() && isBalanced();
  }

  asBinaryString() {
    return this.buffer.join('');
  }
}

module.exports = PuzzleSlice;

},{}],4:[function(require,module,exports){
/**
 * This is reponsible for solving Binox puzzles of any size. Currently, it is only tested on 6x6 but it should
 * work w/ any size (to a certain extent) given the runtime computation cost.
 *
 * This will not modify the puzzle. The board is immutable.
 */
class PuzzleSolutionSolver {
  solve(board) {
    let activeBoardPointer = board;
    const pointsToSolveFor = activeBoardPointer.getIndiciePairsThatAreNotFilledIn();
    let iterationsBeforeGivingUp = pointsToSolveFor.length;
    const originalIterationsBeforeGivingUp = iterationsBeforeGivingUp;

    while (pointsToSolveFor.length > 0) {
      const pointToSolveFor = pointsToSolveFor.shift();
      const theoryWithOne = this._isTheorySafe(activeBoardPointer, pointToSolveFor, '1');
      const theoryWithZero = this._isTheorySafe(activeBoardPointer, pointToSolveFor, '0');

      if (theoryWithOne ^ theoryWithZero) {
        const tokenToProceedWith = theoryWithOne ? '1' : '0';
        activeBoardPointer = activeBoardPointer.withPointChangedTo(
          pointToSolveFor,
          tokenToProceedWith
        );

        // Let it cycle around the list a few times. This could be dangerous in some cases since
        // you might let things spin for a long time but this should only happen on VERY large boards. So it's not a huge deal
        iterationsBeforeGivingUp = originalIterationsBeforeGivingUp;
      } else {
        // Both were doable, so we cannot make a choice since we are unsured yet
        // so we place it back on the queue in hopes that something other mutation
        pointsToSolveFor.push(pointToSolveFor);

        iterationsBeforeGivingUp--;
      }

      if (iterationsBeforeGivingUp === 0) {
        throw new Error(
          'Reached the max iteration count. Could not converge on a solution. Giving up...'
        );
      }
    }

    return activeBoardPointer;
  }

  // helper functions
  _isTheorySafe(board, point, token) {
    board = board.withPointChangedTo(point, token);
    const slices = board.getSlicesForPoint(point);

    const horizontalSlice = slices[0];
    const verticalSlice = slices[1];

    const isMaintainingSliceQuotaIntegrity =
      !horizontalSlice.isExceedingQuota() && !verticalSlice.isExceedingQuota();

    const isMaintainingRunIntegrity =
      horizontalSlice.isNotSlidingWindowLargerThanThree() &&
      verticalSlice.isNotSlidingWindowLargerThanThree();

    return isMaintainingRunIntegrity && isMaintainingSliceQuotaIntegrity;
  }
}

module.exports = PuzzleSolutionSolver;

},{}],5:[function(require,module,exports){
const PuzzleSolutionSolver = require('./PuzzleSolutionSolver');
const PuzzleBoard = require('./PuzzleBoard');

/**
 * This is the default export since we want to provide one to make the module easier to use.
 * You can still access the internals if you need to by loading the module and requiring files
 * in from the path of it.
 */
module.exports = {
  solver: PuzzleSolutionSolver,
  board: PuzzleBoard
};

},{"./PuzzleBoard":2,"./PuzzleSolutionSolver":4}]},{},[5])(5)
});
