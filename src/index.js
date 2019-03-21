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
