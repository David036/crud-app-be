import { NextFunction, Request, Response } from 'express';

export const paginationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
  ) => {
  const pageParam = req.query.page;
  const pageSizeParam = req.query.pageSize;

  const page = (typeof pageParam === 'string' ? parseInt(pageParam) : 1) || 1;
  const pageSize = (typeof pageSizeParam === 'string' ? parseInt(pageSizeParam) : 5) || 5;

  req.body.page = page;
  req.body.pageSize = pageSize;

  const skip = (page - 1) * pageSize;
  req.body.skip = skip;

  return next();
};
