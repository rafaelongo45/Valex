import { Request, Response } from "express";

import * as cardService from "../Services/cardService.js";

export async function createCard(req: Request, res: Response){
  await cardService.createUserCard(req.body);
  return res.sendStatus(201);
};

export async function activateCard(req: Request, res: Response){
  const { id } = req.params;
  await cardService.activateCard(req.body, id);
  return res.sendStatus(200);
};