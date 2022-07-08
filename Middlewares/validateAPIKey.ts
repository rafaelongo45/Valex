import { NextFunction, Request, Response } from "express";

import { APIKeyExists } from "../Services/cardService.js";

export async function validateKey(req: Request, res: Response, next: NextFunction){
  const { key } = req.headers; //TODO: Como tipar o headers?

  if(!key){
    throw {type: "APIKey", message: "API Key not sent", code: 401}
  }

  await APIKeyExists(key);

  next();
}