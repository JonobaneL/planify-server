export class CustomError extends Error {
  statusCode: number;
  errors: string[];
  constructor(message: string, statusCode: number, errors: string[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
  static BadRequest(message: string, errors: string[] = []) {
    return new CustomError(message, 400, errors);
  }
  static Unauthorized() {
    return new CustomError("Unauthorized user", 401);
  }
  static Forbidden() {
    return new CustomError("Forbidden", 403);
  }
  static NotFound(message: string) {
    return new CustomError(message, 404);
  }
}
