class ApiCustomError extends Error {
  constructor(message, details = null, status = 500) {
    super(message);
    this.errorMessage = message;
    this.details = message;
    this.status = 500;
  }
}

module.exports = ApiCustomError;
