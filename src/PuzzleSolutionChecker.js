const Point = require('./Point');

/*
    This class is more or less responsible for just checking if a board given is correct. It can be used for validating the result
    of the algorithim in the end. It's nothing complicated.
*/
class PuzzleSolutionChecker {
  validate(board) {
    // To check if the board is legal, simply every slice have to be legal and the set for getitng all unfilled points is empty
    // That's it.

    const remainingPointsToBeFilled = board.getIndiciePairsThatAreNotFilledIn();
    if (remainingPointsToBeFilled.length > 0) {
      return false;
    }

    const horizontalSlices = new Set();
    const verticalSlices = new Set();
    const expectedSlices = board.getLength();

    for (let x = 0; x < board.getLength(); x++) {
      for (let y = 0; y < board.getLength(); y++) {
        const slices = board.getSlicesForPoint(new Point(x, y));
        const areSlicesValid = slices.every(slice => slice.isValidSlice());

        horizontalSlices.add(slices[0].asBinaryString());
        verticalSlices.add(slices[1].asBinaryString());

        if (!areSlicesValid) {
          return false;
        }
      }
    }

    const areSlicesUnique =
      verticalSlices.size === expectedSlices && horizontalSlices.size === expectedSlices;

    return areSlicesUnique;
  }
}

module.exports = PuzzleSolutionChecker;
