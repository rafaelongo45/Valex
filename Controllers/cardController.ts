import { Request, Response } from "express";

import { createUserCard } from "../Services/cardService.js";

export async function createCard(req: Request, res: Response){
  const userRequest = await createUserCard(req.body);
  return res.sendStatus(201);
}