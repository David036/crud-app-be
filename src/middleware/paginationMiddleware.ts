import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      pagination: {
        limit: number;
        startIndex: number;
      };
    }
  }
}

export const paginationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const paginationQuery = {
    limit: req.query.limit,
    offset: req.query.offset,
    startIndex: req.query.offset,
  };
  // const pageParam = req.query.page;
  // const pageSizeParam = req.query.pageSize;

  const startIndex =
    (typeof paginationQuery.startIndex === "string"
      ? parseInt(paginationQuery.startIndex)
      : 1) || 1;
  const limit =
    (typeof paginationQuery.limit === "string"
      ? parseInt(paginationQuery.limit)
      : 10) || 10;

  // req.body.page = page;
  // req.body.pageSize = pageSize;

  // const skip = (page - 1) * pageSize;
  // req.body.skip = skip;

  req.pagination = {
    limit,
    startIndex,
  };

  next();
};
