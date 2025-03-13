import { CustomError } from "../utils/customError";

export const errorMiddleware = (err: any, req: any, res: any, next: any) => {
  console.log(err);
  if (err instanceof CustomError) {
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message, errors: err.errors });
  }

  res.status(err.statusCode || 500).json({ message: err.message });
};
