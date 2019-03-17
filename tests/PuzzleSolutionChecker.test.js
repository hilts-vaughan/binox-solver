const BoardBuilder = require('./utils/BoardBuilder');
const PuzzleBoard = require('../src/PuzzleBoard');
const PuzzleSolutionChecker = require('../src/PuzzleSolutionChecker');

const boardWithSomeThingsNeedFillingIn = new BoardBuilder()
  .addBinaryStringRow('X11')
  .addBinaryStringRow('1XX')
  .addBinaryStringRow('111')
  .build();

// There is no zeroes here and there is a requirement that rows are legal and valid
// This is a blatant error since there is duplication etc
const filledBoardWithInvalidSliceSinceThereAreNoZeroes = new BoardBuilder()
  .addBinaryStringRow('1111')
  .addBinaryStringRow('1111')
  .addBinaryStringRow('1111')
  .addBinaryStringRow('1111')
  .build();

const solver = new PuzzleSolutionChecker();

describe('PuzzleSolutionChecker', () => {
  describe('validate', () => {
    it('should return false if the board has anything left that is needs to be filled in with, despite any slice validations`', () => {
      const board = PuzzleBoard.fromBoardBinaryString(boardWithSomeThingsNeedFillingIn);
      const didValidate = solver.validate(board);
      expect(didValidate).toBe(false);
    });

    it('should return false if there are any illegal slices inside of the board', () => {
      const board = PuzzleBoard.fromBoardBinaryString(
        filledBoardWithInvalidSliceSinceThereAreNoZeroes
      );
      const didValidate = solver.validate(board);
      expect(didValidate).toBe(false);
    });

    it('should validate if the rows and columns are unique and legal otherwise', () => {
      // A small, yet legal board
      const smallBoard = new BoardBuilder()
        .addBinaryStringRow('10')
        .addBinaryStringRow('01')
        .build();

      const board = PuzzleBoard.fromBoardBinaryString(smallBoard);

      const didValidate = solver.validate(board);
      expect(didValidate).toBe(true);
    });

    // The below tests are not exhaustive, they are just checking
    // for some easy to test cases to ensure things are progressing smoothly
    // in development. You can check the full integration suite for the entire
    // set of known puzzles it can solve

    it('should validate some easy Binox puzzle', () => {
      // https://krazydad.com/binox/sfiles/BINOX_6x6_EZ_v1_4pp_b1.pdf
      // This is the 24th puzzle on the page. We're validating this one here

      const easyBoardString = new BoardBuilder()
        .addBinaryStringRow('100110')
        .addBinaryStringRow('001101')
        .addBinaryStringRow('011001')
        .addBinaryStringRow('110010')
        .addBinaryStringRow('100101')
        .addBinaryStringRow('011010')
        .build();

      const board = PuzzleBoard.fromBoardBinaryString(easyBoardString);
      const didValidate = solver.validate(board);
      expect(didValidate).toBe(true);
    });

    it('should validate some difficult Binox puzzles', () => {
      // https://krazydad.com/binox/sfiles/BINOX_6x6_TF_v2_4pp_b3.pdf
      // This is the 24th puzzle on this page.

      const toughestPuzzleStrings = new BoardBuilder()
        .addBinaryStringRow('101100')
        .addBinaryStringRow('010011')
        .addBinaryStringRow('100110')
        .addBinaryStringRow('001101')
        .addBinaryStringRow('011001')
        .addBinaryStringRow('110010')
        .build();

      const board = PuzzleBoard.fromBoardBinaryString(toughestPuzzleStrings);
      const didValidate = solver.validate(board);
      expect(didValidate).toBe(true);
    });
  });
});
