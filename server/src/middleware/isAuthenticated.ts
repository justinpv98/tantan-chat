import { NextFunction, Request, Response } from "express-serve-static-core";

export default function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  // Authenticated user should have sessionID and a user in session.
  if (req.sessionID && req.session.user) {
    next();
  } else {
    res.status(401);
    throw new Error("Invalid credentials.");
  }
}
