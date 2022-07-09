import { Request, Response } from "express";

import { createPurchase } from "../Services/paymentService.js";

export async function postPurchase(req: Request <{ businessId: number }>, res: Response){
  const { businessId } = req.params;
  const { cardId, password, amount } : { cardId: number, password: number, amount: number } = req.body;
  await createPurchase(businessId, cardId, password, amount);
  return res.sendStatus(201);
};