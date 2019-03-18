const PuzzleSlice = require('../src/PuzzleSlice');

describe('PuzzleSlice', () => {
  const SIMPLE_STRING = '1010';
  const SLICE_FROM_SIMPLE_STRING = PuzzleSlice.fromBinaryString(SIMPLE_STRING);

  describe('constructor', () => {
    it('should throw an exception if the length provided is less than or equal to 0 since it is not a legal state', () => {
      const shouldThrow = () => {
        new PuzzleSlice(0);
      };
      const shouldThrowNegative = () => {
        new PuzzleSlice(-49058);
      };
      const shouldNotThrowPositive = () => {
        new PuzzleSlice(12);
      };

      expect(shouldThrow).toThrow();
      expect(shouldThrowNegative).toThrow();
      expect(shouldNotThrowPositive).not.toThrow();
    });
  });

  describe('asBinaryString', () => {
    it('should expect to get the binary string value back from the item', () => {
      const fromSliceToString = SLICE_FROM_SIMPLE_STRING.asBinaryString();
      expect(fromSliceToString).toBe(SIMPLE_STRING);
    });
  });

  describe('fromBinaryString', () => {
    it('should throw if you are given an empty binary string since this is not supported', () => {
      const shouldThrowSinceEmpty = () => {
        PuzzleSlice.fromBinaryString('');
      };

      expect(shouldThrowSinceEmpty).toThrow();
    });

    it('should throw if a character that is not understood is provided', () => {
      const INVALID_BINARY_STRING_SPACE = '1000 1';
      const INVALID_BINARY_STRING_OTHER_CHARS = '1000C1';
      const INVALID_BINARY_STRING_STRANGE = '-1';

      const TEST_CASES = [
        INVALID_BINARY_STRING_OTHER_CHARS,
        INVALID_BINARY_STRING_SPACE,
        INVALID_BINARY_STRING_STRANGE
      ];

      // Test each one in turn, since it's a waste to write a test per each case
      TEST_CASES.forEach(testCase => {
        expect(() => PuzzleSlice.fromBinaryString(testCase)).toThrow();
      });
    });

    it('should provide a slice with the values specified inside of the binary string when requested', () => {
      const BINARY_STRING = '1010101';
      const SPLIT_STRING = Array.from(BINARY_STRING);
      const slice = PuzzleSlice.fromBinaryString(BINARY_STRING);

      for (let index = 0; index < SPLIT_STRING.length - 1; index++) {
        const character = SPLIT_STRING[index];
        const value = slice.get(index);
        expect(character).toBe(value);
      }

      // The slice was parsed right
    });

    describe('getLength', () => {
      it('should give the valid length of buffer back', () => {
        expect(SLICE_FROM_SIMPLE_STRING.getLength()).toBe(SIMPLE_STRING.length);
      });
    });

    describe('get', () => {
      it('should throw if trying to acess illegal indices, such as out of bounds', () => {
        const shouldThowNegativeIndice = () => {
          SLICE_FROM_SIMPLE_STRING.get(-1);
        };

        const shouldThrowLargeOutOfBoundsIndices = () => {
          SLICE_FROM_SIMPLE_STRING.get(SIMPLE_STRING.length + 1);
        };

        const shouldNotBeThrowingWhenTestingWithinBounds = () => {
          SLICE_FROM_SIMPLE_STRING.get(SIMPLE_STRING.length - 1);
        };

        expect(shouldThowNegativeIndice).toThrow();
        expect(shouldThrowLargeOutOfBoundsIndices).toThrow();
        expect(shouldNotBeThrowingWhenTestingWithinBounds).not.toThrow();

        // Should return the right values from the simple string arrays... but we validted this in the above constructor using get
        // so I am not going to bother writing a duplicate test here. If you are interested in that, read the above test w/ the static
        // constructor
      });
    });

    describe('isValidSlice', () => {
      it('should return false if the number of zeros and one are not balanced at all', () => {
        const UNBALANCED_STRING = '100000000';
        const slice = PuzzleSlice.fromBinaryString(UNBALANCED_STRING);
        expect(slice.isValidSlice()).toBe(false);
        expect(slice.isValidSlice()).toBe(false);
      });

      it('should return false if the number of items are balanced but there are runs inside of the strings', () => {
        const STRING_WITH_RUNS = '111000'; // balanced but has 3 in a row which is not permitted
        const slice = PuzzleSlice.fromBinaryString(STRING_WITH_RUNS);
        expect(slice.isValidSlice()).toBe(false);
      });

      it('should return true for balanced strings with runs of two', () => {
        const BALANCED_STRING_RUNS_OF_TWO = '110010'; // has a max run of two, so things are OK
        const slice = PuzzleSlice.fromBinaryString(BALANCED_STRING_RUNS_OF_TWO);
        expect(slice.isValidSlice()).toBe(true);
      });

      it('should validate slices that are short fine still', () => {
        const SMALL_STRING = '10';
        const slice = PuzzleSlice.fromBinaryString(SMALL_STRING);
        expect(slice.isValidSlice()).toBe(true);
      });

      it('should return true even if there is a run with Xs in it since these are allowed, since they are not yet determined', () => {
        const SMALL_STRING_RUN_WITH_UNKNOWNS = 'XXX10'; // balanced but has a run
        const slice = PuzzleSlice.fromBinaryString(SMALL_STRING_RUN_WITH_UNKNOWNS);
        expect(slice.isValidSlice()).toBe(true);
      });
    });
  });
});
