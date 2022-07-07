import { NextFunction, Request, Response } from "express";

export function validateCardType(req: Request, res: Response, next:NextFunction){
  const { type } = req.body;
  const validTypes = ['groceries', 'restaurants', 'transport', 'education', 'health'];

  if(!validTypes.includes(type)){
    throw {type: "CardError", message: "Invalid card type", code: 400};
  };

  next();
};