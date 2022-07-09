import * as cardRepository from "../repositories/cardRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as cardService from "../Services/cardService.js";

export function isAmountValid(amount: number){
  const validAmount = amount && amount > 0

  if(!validAmount){
    throw { type: "amountError", message: "Amount must be higher than zero", code: 400}
  }
};

export async function isCardActive(cardId: number){
  const card = await cardRepository.findById(cardId);
  
  if(!card.password){
    throw { type: "activationError", message: "Card is not active", code: 403}
  }
};

async function insertAmount(cardId: number, amount: number){
  const rechargeData = {
    cardId,
    amount
  }
  await rechargeRepository.insert(rechargeData)
};

export async function recharge(cardId, amount: number){
  isAmountValid(amount);
  await cardService.cardExists(cardId);
  await isCardActive(cardId);
  await cardService.isCardExpired(cardId);
  await insertAmount(cardId, amount);
};