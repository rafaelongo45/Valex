import { NextFunction, Request, Response } from "express";

export async function handleError(error, req: Request, res: Response, next: NextFunction){ //TODO: Verificar tipo do "error"
  if(error) return res.status(error.code).send(error.message);
  return res.sendStatus(500);
};