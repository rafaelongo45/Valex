import { Request, Response } from "express";

import { createUserCard } from "../Services/cardService.js";

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

  const userRequest = await createUserCard(req.body);
  return res.status(201).send("ok");
}