import { NextFunction, Request, Response } from "express";

export async function handleError(error, req: Request, res: Response, next: NextFunction){
  if(error) return res.status(error.code).send(error.message);
  console.error(error);
  return res.sendStatus(500);
};