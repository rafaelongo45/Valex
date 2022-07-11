import { findById, findByIdAndCardId } from "../repositories/businessRepository.js";

import * as cardService from "./cardService.js";
import * as rechargeService from "./rechargeService.js";
import * as paymentRepository from "../repositories/paymentRepository.js";

function checkAmount(amount: number){
  const validAmount = amount > 0 && amount;

  if(!validAmount){
    throw { type: "amountError", message: "Invalid amount sent", code: 400};
  };
};

async function businessExists(id: number){
  const business = await findById(id);

  if(!business){
    throw { type: "businessError", message: "Business doesn't exist", code: 404};
  }
};

async function checkBusinessAndCardType(businessId: number, cardId: number){
  const business = await findByIdAndCardId(businessId, cardId);

  if(!business){
    throw { type: "typeError", message: "Business and card are from different types", code: 400};
  }
};

function isPurchaseValid(balance: number, amount: number){
  if(amount > balance){
    throw { type: "balanceError", message: "Card doesn't have enough credit to make this purchase", code: 403};
  }
}

export async function createPurchase(businessId: number, cardId: number, password: number, amount: number){
  checkAmount(amount);
  await cardService.cardExists(cardId);
  await rechargeService.isCardActive(cardId);
  await cardService.isCardExpired(cardId);
  await cardService.isBlocked(cardId);
  await cardService.checkPassword(password);
  await cardService.comparePassword(cardId, password);
  await businessExists(businessId);
  await checkBusinessAndCardType(businessId, cardId);
  const cardTransactions = await cardService.getTransactions(cardId);
  const cardRecharges = await cardService.getRecharges(cardId);
  const balance = await cardService.cardBalance(cardRecharges.totalRecharges, cardTransactions.totalTransactions);
  isPurchaseValid(balance, amount);
  const paymentData = {
    cardId,
    businessId,
    amount
  }
  await paymentRepository.insert(paymentData);
};

export async function createOnlinePurchase(businessId: number, number: string, name: string, expirationDate: string, securityCode: number, amount:number){
  checkAmount(amount);
  const cardId = await cardService.getCardByDetails(number, name, expirationDate);
  await rechargeService.isCardActive(cardId);
  await cardService.isCardExpired(cardId);
  await cardService.isBlocked(cardId);
  await businessExists(businessId);
  await checkBusinessAndCardType(businessId, cardId);
  const cardTransactions = await cardService.getTransactions(cardId);
  const cardRecharges = await cardService.getRecharges(cardId);
  const balance = await cardService.cardBalance(cardRecharges.totalRecharges, cardTransactions.totalTransactions);
  isPurchaseValid(balance, amount); 
  const paymentData = {
    cardId,
    businessId,
    amount
  }
  await paymentRepository.insert(paymentData);
}