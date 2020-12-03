class NotFoundError extends Error {
  constructor(item) {
    super(item + " not found");
    this.name = "NotFoundError";
    this.status = 404;
    this.log = item + " not found";
  }
}

class ObjectIdError extends Error {
  constructor(item) {
    super(item + " not found");
    this.name = "ObjectIdError";
    this.status = 404;
    this.log = "Invalid object id";
  }
}

class ServerError extends Error {
  constructor(log) {
    super("Server error");
    this.name = "Server error";
    this.status = 500;
    this.log = log;
  }
}

class InvalidCredentialsError extends Error {
  constructor(log) {
    super("Login credentials are not valid");
    this.name = "InvalidCredentialsError";
    this.status = 401;
    this.log = log;
  }
}

class JWTAuthenticationError extends Error {
  constructor(log) {
    super("Unauthorized");
    this.name = "JWTAuthenticationError";
    this.status = 401;
    this.log = log;
  }
}

module.exports = {
  NotFoundError,
  ObjectIdError,
  ServerError,
  InvalidCredentialsError,
  JWTAuthenticationError,
};
