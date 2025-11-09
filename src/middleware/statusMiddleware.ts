import z, { ZodObject } from "zod";

export const statusMiddleware = (schema: ZodObject<any>) => {
  return (req: any, res: any, next: any) => {
    const parseResult = schema.safeParse(req.body);

    if (!parseResult.success) {
      const issues = parseResult.error.issues;
      const unknownField = issues.find(
        (issue) => issue.code === "unrecognized_keys"
      );

      if (unknownField) {
        const field = unknownField.keys[0];
        return res.status(400).json({
          error: `Field "${field}" is immutable and cannot be updated`,
        });
      }

      return res.status(400).json({
        error: "Validation failed",
        details: z.prettifyError(parseResult.error),
      });
    }

    req.body = parseResult.data;
    next();
  };
};
