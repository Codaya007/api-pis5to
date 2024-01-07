class ValidationError extends Error {
<<<<<<< HEAD
    constructor(message) {
      super(message);
      this.name = "ValidationError";
      this.status = 400;
    }
  }
  
  module.exports = ValidationError;
=======
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.status = 400;
  }
}

module.exports = ValidationError;
>>>>>>> df696440bc22df7207ee644e58b30dc719bf2088
