import {
  Request,
  Response,
  NextFunction,
} from "express";

import { getAuth } from "@clerk/express";

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { userId } =
    getAuth(req);

  if (!userId) {
    return res.status(401).json({
      success: false,

      message:
        "Authentication required",
    });
  }

  res.locals.userId =
    userId;

  next();
}