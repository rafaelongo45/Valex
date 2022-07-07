import { APIKeyExists } from "../Services/cardService.js";
import { NextFunction, Request, Response } from "express";

export async function validateKey(req: Request, res: Response, next: NextFunction){
  const { key } = req.headers;

  if(!key){
    throw {type: "APIKey", message: "API Key not sent", code: 401}
  }

  await APIKeyExists(key);

  next();
}