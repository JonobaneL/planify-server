export class CustomError extends Error {
  statusCode: number;
  errors: any[];
  constructor(message: string, statusCode: number, errors: any[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
  static BadRequest(message: string, errors: any[] = []) {
    return new CustomError(message, 400, errors);
  }
  static Unauthorized(message?: string) {
    return new CustomError(message ?? "Unauthorized user", 401);
  }
  static Forbidden() {
    return new CustomError("Forbidden", 403);
  }
  static NotFound(message: string) {
    return new CustomError(message, 404);
  }
  static Internal(message: string, errors: any[] = []) {
    return new CustomError(message, 500, errors);
  }
}
