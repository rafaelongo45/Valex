import { NextFunction, Request, Response } from "express";

export function validateCardType(req: Request, res: Response, next:NextFunction){
  const { type } : { type: string } = req.body;
  const validTypes = ['groceries', 'restaurant', 'transport', 'education', 'health'];
  const isCardValid = validTypes.includes(type)

  if(!isCardValid){
    throw {type: "CardError", message: "Invalid card type", code: 400};
  };

  next();
};