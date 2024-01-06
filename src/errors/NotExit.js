class NotExist extends Error {
    constructor(message) {
      super(message);
      this.name = "NotExist";
      this.status = 404;
    }
  }
  
  module.exports = NotExist;
  