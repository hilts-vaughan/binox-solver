const PuzzleBoard = require('../src/PuzzleBoard');
const Point = require('../src/Point');
const BoardBuilder = require('./utils/BoardBuilder');

const boardWithSomeThingsNeedFillingIn = new BoardBuilder()
  .addBinaryStringRow('X11')
  .addBinaryStringRow('1XX')
  .addBinaryStringRow('111')
  .build();

describe('PuzzleBoard', () => {
  describe('fromBoardBinaryString', () => {
    it('should reject things that are not squared, since the boards must be square in general', () => {
      const illegalBoard = new BoardBuilder()
        .addBinaryStringRow('11111111111111111')
        .build();

      const shouldThrowSinceTheBoardIsTooLarge = () => {
        PuzzleBoard.fromBoardBinaryString(illegalBoard);
      };

      expect(shouldThrowSinceTheBoardIsTooLarge).toThrow();
    });

    it('should reject things with characters that are not legal for the board, even if square', () => {
      const illegalBoard = new BoardBuilder().addBinaryStringRow('C').build();
      const illegalBoardSomeLegal = new BoardBuilder()
        .addBinaryStringRow('1X')
        .addBinaryStringRow('C1')
        .build();

      const shouldThrowSinceTheBoardHasSomeIllegalCharacterInsideOfIt = () => {
        PuzzleBoard.fromBoardBinaryString(illegalBoard);
      };

      const shouldThrowSinceTheBoardHasIllegalCharactersEvenIfItHasSomeLegalOnes = () => {
        PuzzleBoard.fromBoardBinaryString(illegalBoardSomeLegal);
      };

      expect(shouldThrowSinceTheBoardHasSomeIllegalCharacterInsideOfIt).toThrow();

      expect(
        shouldThrowSinceTheBoardHasIllegalCharactersEvenIfItHasSomeLegalOnes
      ).toThrow();
    });
  });

  it('should accept a string that is well formed', () => {
    const wellFormedString = new BoardBuilder()
      .addBinaryStringRow('111')
      .addBinaryStringRow('1X1')
      .addBinaryStringRow('1X1')
      .build();

    const board = PuzzleBoard.fromBoardBinaryString(wellFormedString);
  });

  describe('getIndiciePairsThatAreNotFilledIn', () => {
    it('should return an empty set when there is nothing inside of the empty board', () => {
      const boardWithAlreadyEverythingFilledIn = new BoardBuilder()
        .addBinaryStringRow('111')
        .addBinaryStringRow('111')
        .addBinaryStringRow('111')
        .build();

      const board = PuzzleBoard.fromBoardBinaryString(boardWithAlreadyEverythingFilledIn);
      const set = board.getIndiciePairsThatAreNotFilledIn();

      expect(board.length).toBe();
    });

    it('should return the expected coordinates of multiple points when there are slots there that need filling in', () => {
      const board = PuzzleBoard.fromBoardBinaryString(boardWithSomeThingsNeedFillingIn);

      const assertPointState = (point, x, y) => {
        expect(point.getX()).toBe(x);
        expect(point.getY()).toBe(y);
      };

      const points = board.getIndiciePairsThatAreNotFilledIn();
      const firstPoint = points[0];
      const secondPoint = points[1];
      const thirdPoint = points[2];

      // The algorithim does not actually specify the order but since we know we do a linear scan, the test relies on this
      // If you are reading this to try and figure out if there is an order, no promise are made about the order. You should not
      // need the order either since it's not interesting for what we want to do
      assertPointState(firstPoint, 0, 0);
      assertPointState(secondPoint, 1, 1);
      assertPointState(thirdPoint, 1, 2);
    });
  });

  describe('getSlicesForPoint', () => {
    it('should return a slice for the vertical and horizontal pieces for any given point', () => {
      // There are two slices, and they should have the strings we want
      const expectedHorizontalSlice = '1XX';
      const expectedVerticalSlice = '1X1';
      const board = PuzzleBoard.fromBoardBinaryString(boardWithSomeThingsNeedFillingIn);

      const slices = board.getSlicesForPoint(new Point(1, 1));
      const horizontalSlice = slices[0].asBinaryString();
      const verticalSlice = slices[1].asBinaryString();

      expect(horizontalSlice).toBe(expectedHorizontalSlice);
      expect(verticalSlice).toBe(expectedVerticalSlice);
    });
  });

  describe('withPointChangedTo', () => {
    it('should return a copy of the board without the original changed, with the token requested changed', () => {
      const originalBoard = PuzzleBoard.fromBoardBinaryString(
        boardWithSomeThingsNeedFillingIn
      );

      const newBoardWithChangedValue = originalBoard.withPointChangedTo(
        new Point(0, 0),
        '1'
      );

      const slice = newBoardWithChangedValue.getSlicesForPoint(new Point(0, 0))[0];
      const token = slice.get(0);

      const oldSlice = originalBoard.getSlicesForPoint(new Point(0, 0))[0];
      const oldToken = oldSlice.get(0);

      expect(originalBoard === newBoardWithChangedValue).toBe(false); // verifying the reference in equality since it's a clone
      expect(token).toBe('1');
      expect(oldToken).toBe('X');
    });
  });
});
