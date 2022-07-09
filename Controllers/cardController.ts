import { Request, Response } from "express";

import * as cardService from "../Services/cardService.js";

export async function createCard(req: Request, res: Response){
  await cardService.createUserCard(req.body);
  return res.sendStatus(201);
};

export async function activateCard(req: Request <{ id: number }>, res: Response){
  const { id } = req.params;
  const { securityCode, password } : { securityCode: string, password: number} = req.body;
  await cardService.activateCard(securityCode, password, id);
  return res.sendStatus(200);
};

export async function getCardInfo(req: Request <{id: number}>, res: Response){
  const { id } = req.params;
  const balanceTransactions = await cardService.getBalanceTransactions(id);
  return res.status(200).send(balanceTransactions);
};

export async function blockCard(req: Request <{id: number}>, res: Response){
  const { id } = req.params;
  const { password } : { password: number }= req.body;
  await cardService.blockCard(id, password);
  return res.sendStatus(200);
};

export async function unblockCard(req: Request <{id: number}>, res: Response){
  const { id } = req.params;
  const { password } : { password: number }= req.body;
  await cardService.unblockCard(id, password);
  return res.sendStatus(200);
};