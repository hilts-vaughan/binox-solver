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
