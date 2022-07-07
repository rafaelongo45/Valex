import { Request, Response } from "express";

import { insert } from "../repositories/cardRepository.js";

export async function createCard(req: Request, res: Response){
  const {
    employeeId,
    number,
    cardholderName,
    securityCode,
    expirationDate,
    password,
    isVirtual,
    originalCardId,
    isBlocked,
    type
  } = req.body;

  await insert(req.body);
  return res.sendStatus(201);
}