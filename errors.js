class NotFoundError extends Error {
  constructor(item) {
    super(item + " not found");
    this.name = "NotFoundError";
    this.status = 404;
    this.log = this.message;
  }
}

class ObjectIdError extends NotFoundError {
  constructor(item) {
    super(item);
    this.name = "ObjectIdError";
    this.log = "Invalid object id";
  }
}

module.exports = {
  NotFoundError,
  ObjectIdError,
};
