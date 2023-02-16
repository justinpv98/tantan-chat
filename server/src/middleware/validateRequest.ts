import { NextFunction, Request, Response } from "express";
import z from "zod";

// Function that validates the request body against a given schema
function validateRequest<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request & { value: any }, res: Response, next: NextFunction) => {
    // Validate the request body against the given schema

    const validation = schema.safeParse(req.body);

    // If the request body is invalid, send a 400 Bad Request response
    if (validation.success === false) {
      const { error } = validation;
      res.status(400);
      throw new Error(error.issues[0].message);
    } else {
      // If the request body is valid, attach the validated body to the request object
      if (!req.value) {
        req.value = {};
      }

      req.value["body"] = validation.data;
      next();
    }
  };
}

export default validateRequest;
