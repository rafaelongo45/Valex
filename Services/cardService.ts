import dayjs from "dayjs";
import Cryptr from "cryptr";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

import * as employeeService from "./employeeService.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";

dotenv.config();

async function checkCardType(type: cardRepository.TransactionTypes, employeeId: number){
  const card = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
  
  if(card){
    throw { type: "cardError", message: "User already has card of this type", code: 409};
  }

};

function createExpirationDate(){
  const expirationDate = dayjs().add(5, 'year').format('MM/YY');
  return expirationDate
};

function generateCardNumber(){
  const cardNumber = faker.random.numeric(16);
  return cardNumber;
};

function generateCVC(){
  const encryptKey = process.env.CRYPTRKEY;
  const CVC = faker.random.numeric(3);
  const cryptr = new Cryptr(encryptKey);
  const encryptedCVC : string = cryptr.encrypt(CVC);
  return encryptedCVC;
};

export async function cardExists(cardId: number){
  const card = await cardRepository.findById(cardId);

  if(!card){
    throw { type: "cardError", message: "There is no card registered with this card id", code: 400}
  }
};

function checkExpirationDate(today: string, expirationDate: string){
  const monthToday = today[0] + today[1];
  const yearToday = today[3] + today[4];
  const monthExpiration = expirationDate[0] + expirationDate[1];
  const yearExpiration = expirationDate[3] + expirationDate[4];
  
  const isMonthValid = parseInt(monthExpiration) - parseInt(monthToday) >= 0;
  const isYearValid = parseInt(yearExpiration) - parseInt(yearToday) >= 0;
  const isValid = isMonthValid && isYearValid;
  
  return !isValid;
}

export async function isCardExpired(cardId: number){
  const card = await cardRepository.findById(cardId);
  const today = dayjs().format('MM/YY');
  const isCardExpired = checkExpirationDate(today, card.expirationDate);

  if(isCardExpired){
    throw { type: "dateError", message: "Card is not valid anymore. Date expired.", code: 401}
  }
};

async function cardAlreadyActivated(cardId: number){
  const card = await cardRepository.findById(cardId);

  if(card.password){
    throw { type: "cardError", message: "Card was already activated", code: 403}
  }
};

async function checkSecurityCode(securityCode: number, cardId: number){
  if(!securityCode){
    throw { type: "cardError", message: "CVC not sent", code: 400};
  }

  const card = await cardRepository.findById(cardId);
  const encryptKey = process.env.CRYPTRKEY;
  const cryptr = new Cryptr(encryptKey);
  const decryptedSecurityCode = parseInt(cryptr.decrypt(card.securityCode));

  if(securityCode !== decryptedSecurityCode){
    throw {type: "cardError", message: "Wrong CVC", code: 401};
  }
};

export async function checkPassword(password: number){
  const isLengthValid = password.toString().length === 4;
  const isTypeValid = typeof password === 'number'

  if(!isTypeValid){
    throw { type: "passwordError", message: "Password must only have numbers", code: 400}
  }

  if(!isLengthValid){
    throw { type: "passwordError", message: "Password must have 4 characters", code: 400}
  }
};

async function updatePassword(cardId: number, password: number){
  const SALT = 10;
  const encryptedPassword: string = await bcrypt.hash(password.toString(), SALT)
  await cardRepository.update(cardId, {password: encryptedPassword});
};

async function unblock(cardId: number){
  await cardRepository.update(cardId, {isBlocked: false});
};

async function block(cardId: number){
  await cardRepository.update(cardId, {isBlocked: true});
}

export async function getTransactions(cardId: number){
  const transactions = await paymentRepository.findByCardId(cardId);
  let totalTransactions = 0
  
  for(let i = 0; i < transactions.length; i++){ //TODO: Tentar fazer com reduce
    totalTransactions += transactions[i].amount;
  }

  return {
    transactions,
    totalTransactions
  };
};

export async function getRecharges(cardId: number){
  const recharges = await rechargeRepository.findByCardId(cardId);
  let totalRecharges = 0;

  for(let i = 0; i < recharges.length; i++){ //TODO: Tentar fazer com reduce
    totalRecharges += recharges[i].amount;
  };

  return { 
    recharges,
    totalRecharges
  }
};

export async function cardBalance(income: number, expense: number){
  return income - expense
};

export async function isBlocked(cardId: number){
  const cardInfo = await cardRepository.findById(cardId);
  const isBlocked = cardInfo.isBlocked;
  
  if(isBlocked){
    throw { type: "cardError", message: "Card is blocked", code: 403}
  };
};

async function isUnblocked(cardId: number){
  const cardInfo = await cardRepository.findById(cardId);
  const isBlocked = cardInfo.isBlocked;

  if(!isBlocked){
    throw { type: "cardError", message: "Card is not blocked", code: 403}
  };
}

export async function comparePassword(cardId: number, password: number){
  const card = await cardRepository.findById(cardId);
  const encryptedPassword = card.password;
  const isPasswordCorrect: boolean = bcrypt.compareSync(password.toString(), encryptedPassword);
  
  if(!isPasswordCorrect){
    throw { type: "cardError", message: "Wrong password", code: 403}
  }
};

export async function createUserCard(employeeId: number, type: cardRepository.TransactionTypes){
  await employeeService.employeeExists(employeeId);
  await checkCardType(type, employeeId);
  const employee = await employeeRepository.findById(employeeId);
  const number = generateCardNumber();
  const formattedName = employeeService.formatEmployeeName(employee.fullName);
  const expirationDate = createExpirationDate();
  const securityCode = generateCVC();

  const data = {
      employeeId: employeeId,
      number,
      cardholderName: formattedName,
      originalCardId: null,
      password: null,
      securityCode,
      expirationDate,
      isVirtual: false, //Apenas cartões físicos estão sendo gerados
      isBlocked: true,
      type: type
  }
  
  await cardRepository.insert(data);
};

export async function activateCard(securityCode: number, password: number, cardId: number){
  await cardExists(cardId);
  await isCardExpired(cardId);
  await cardAlreadyActivated(cardId);
  await checkSecurityCode(securityCode, cardId);
  await checkPassword(password);
  await updatePassword(cardId, password);
  await unblock(cardId);
};

export async function getBalanceTransactions(cardId: number){
  await cardExists(cardId);
  const cardTransactions = await getTransactions(cardId);
  const cardRecharges = await getRecharges(cardId);
  const balance = await cardBalance(cardRecharges.totalRecharges, cardTransactions.totalTransactions);
  
  return {
    balance,
    transactions: cardTransactions.transactions,
    recharges: cardRecharges.recharges
  }
};

export async function blockCard(cardId: number, password: number){
  await cardExists(cardId);
  await isCardExpired(cardId);
  await isBlocked(cardId);
  await checkPassword(password);
  await comparePassword(cardId, password);
  await block(cardId);
};

export async function unblockCard(cardId: number, password: number){
  await cardExists(cardId);
  await isCardExpired(cardId);
  await isUnblocked(cardId);
  await checkPassword(password);
  await comparePassword(cardId, password);
  await unblock(cardId);
};