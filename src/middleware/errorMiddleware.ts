import { CustomError } from "../utils/customError";

export const errorMiddleware = (err: any, req: any, res: any, next: any) => {
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message, errors: err.errors });
  }
  return res.status(err.statusCode || 500).json({ message: err.message });
};
