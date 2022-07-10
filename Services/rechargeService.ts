import * as cardService from "../Services/cardService.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";

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

async function isEmployeeFromCompany(cardId: number, apiKey){
  const cardDetails = await cardRepository.findById(cardId);
  const employeeDetails = await employeeRepository.findById(cardDetails.employeeId);
  const companyDetails = await companyRepository.findByApiKey(apiKey);
  const isFromCompany = companyDetails.id === employeeDetails.companyId

  if(!isFromCompany){
    throw { type: "rechargeError", message: "Employee doesn't belong to the company", code: 403}
  }
};


export async function recharge(cardId, amount: number, key){
  isAmountValid(amount);
  await cardService.cardExists(cardId);
  await isCardActive(cardId);
  await cardService.isCardExpired(cardId);
  await isEmployeeFromCompany(cardId, key);
  await insertAmount(cardId, amount);
};