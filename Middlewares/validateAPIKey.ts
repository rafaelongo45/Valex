import { NextFunction, Request, Response } from "express";

import * as companyRepository from "../repositories/companyRepository.js";

async function APIKeyExists(key){
  const companyRequest = await companyRepository.findByApiKey(key);

  if(!companyRequest){
    throw { type:"APIKey", message: "No company has this API Key", code:400 }
  }
};

export async function validateKey(req: Request <{ key: string }>, res: Response, next: NextFunction){
  const { key } = req.headers; 

  if(!key){
    throw {type: "APIKey", message: "API Key not sent", code: 401}
  }

  await APIKeyExists(key);
  next();
};

