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
