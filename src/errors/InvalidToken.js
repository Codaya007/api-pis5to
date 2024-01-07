class InvalidToken extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidToken";
    this.status = 406;
  }
}

module.exports = InvalidToken;
