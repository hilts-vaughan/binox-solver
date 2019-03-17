const BoardBuilder = require('./utils/BoardBuilder');
const PuzzleSolutionSolver = require('../src/PuzzleSolutionSolver');
const PuzzleBoard = require('../src/PuzzleBoard');
const PuzzleSolutionChecker = require('../src/PuzzleSolutionChecker');

const solver = new PuzzleSolutionSolver();

const assertSolve = board => {
  const solver = new PuzzleSolutionChecker();
  const isSolved = solver.validate(board);
  expect(isSolved).toBe(true);
};

const tryAndSolve = boardString => {
  const board = PuzzleBoard.fromBoardBinaryString(boardString);
  const solution = solver.solve(board);
  assertSolve(solution);
};

describe('PuzzleSolutionSolver', () => {
  it('should fail to solve something that is clearly not solvable, for example if the input board fails constraints', () => {
    // You might consider something with 3 Xs already in a row, allowing nothing to be placed there
  });

  it('should fail to solve something that is clearly not solvable, for example if the input is legal but balance is off', () => {});

  describe('easy sample inputs', () => {
    it('should solve some easy Binox boards', () => {
      const easyBoardString = new BoardBuilder()
        .addBinaryStringRow('1XXXXX')
        .addBinaryStringRow('X0XXX1')
        .addBinaryStringRow('XX11XX')
        .addBinaryStringRow('XX1XX0')
        .addBinaryStringRow('XXXX1X')
        .addBinaryStringRow('X11XXX')
        .build();

      tryAndSolve(easyBoardString);
    });

    it('should try and do the hardest easy board on the first book', () => {
      // https://krazydad.com/binox/sfiles/BINOX_6x6_EZ_v1_4pp_b1.pdf
      // #24 from here
      const harderEasyBoardString = new BoardBuilder()
        .addBinaryStringRow('X0XXXX')
        .addBinaryStringRow('0XXXX1')
        .addBinaryStringRow('X1XX0X')
        .addBinaryStringRow('11X0XX')
        .addBinaryStringRow('XX0XXX')
        .addBinaryStringRow('X1XXX0')
        .build();

      tryAndSolve(harderEasyBoardString);
    });
  });
});
