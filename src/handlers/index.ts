import { Request, Response, NextFunction } from 'express';

export const indexHandler = (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ message: 'Service online!' });
};
