class BoardBuilder {
  constructor() {
    this.rows = [];
  }

  addBinaryStringRow(binaryString) {
    this.rows.push(Array.from(binaryString));
    return this;
  }

  build() {
    return this.rows.join('\n').replace(/,/g, '');
  }
}

module.exports = BoardBuilder;
