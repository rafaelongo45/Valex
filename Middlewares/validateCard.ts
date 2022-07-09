import { NextFunction, Request, Response } from "express";

export function validateCardType(req: Request, res: Response, next:NextFunction){
  const { type } : { type: string } = req.body;
  const validTypes = ['groceries', 'restaurant', 'transport', 'education', 'health'];

  if(!validTypes.includes(type)){
    throw {type: "CardError", message: "Invalid card type", code: 400};
  };

  next();
};