import { Request, Response } from "express";

import { createOnlinePurchase, createPurchase } from "../Services/paymentService.js";

export async function postPurchase(req: Request <{ businessId: number }>, res: Response){
  const { businessId } = req.params;
  const { cardId, password, amount } : { cardId: number, password: number, amount: number } = req.body;
  await createPurchase(businessId, cardId, password, amount);
  return res.sendStatus(201);
};

export async function onlinePurchase(req: Request <{businessId: number}>, res: Response){
  const { businessId } = req.params;
  const { number, name, expirationDate, securityCode, amount } : { number: string, name: string, expirationDate: string, securityCode: number, amount: number} = req.body;
  await createOnlinePurchase(businessId, number, name, expirationDate, securityCode, amount);
  return res.sendStatus(201);
};