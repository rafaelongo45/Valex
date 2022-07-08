import dayjs from "dayjs";
import Cryptr from "cryptr";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

import * as employeeService from "./employeeService.js";
import * as cardRepository from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";

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
}

function generateCVC(){
  const encryptKey = process.env.CRYPTRKEY;
  const CVC = faker.random.numeric(3);
  const cryptr = new Cryptr(encryptKey);
  const encryptedCVC = cryptr.encrypt(CVC);
  return encryptedCVC;
};

async function cardExists(cardId){
  const card = await cardRepository.findById(cardId);

  if(!card){
    throw { type: "cardError", message: "There is no card registered with this card id", code: 400}
  }
};

async function isCardExpired(cardId){
  const card = await cardRepository.findById(cardId);
  const today = dayjs().format('MM/YY');
  const isTodayAfterExpirationDate = dayjs(card.expirationDate).isBefore(today)
  
  if(isTodayAfterExpirationDate){
    throw { type: "dateError", message: "Card is not valid anymore. Date expired.", code: 401}
  }
};

async function cardAlreadyActivated(cardId){
  const card = await cardRepository.findById(cardId);

  if(card.password){
    throw { type: "cardError", message: "Card was already activated", code: 403}
  }
};

async function checkSecurityCode(securityCode, cardId){
  if(!securityCode){
    throw { type: "cardError", message: "CVC not sent", code: 400};
  }

  const card = await cardRepository.findById(cardId);
  const encryptKey = process.env.CRYPTRKEY;
  const cryptr = new Cryptr(encryptKey);
  const decryptedSecurityCode = cryptr.decrypt(card.securityCode);
  console.log(decryptedSecurityCode) //TODO: Excluir linha depois
  if(securityCode !== decryptedSecurityCode){
    throw {type: "cardError", message: "Wrong CVC", code: 401};
  }
}

async function checkPassword(password: number){
  if(typeof password !== 'number'){
    throw { type: "passwordError", message: "Password must only have numbers", code: 400}
  }

  if(password.toString().length !== 4){
    throw { type: "passwordError", message: "Password must have 4 characters", code: 400}
  }
}

async function updatePassword(cardId, password){
  const SALT = 10;
  const encryptedPassword = await bcrypt.hash(password.toString(), SALT)
  await cardRepository.update(cardId, {password: encryptedPassword});
}

export async function createUserCard(body){
  await employeeService.employeeExists(body.employeeId);
  await checkCardType(body.type, body.employeeId);
  const employee = await employeeRepository.findById(body.employeeId);
  const number = generateCardNumber();
  const formattedName = employeeService.formatEmployeeName(employee.fullName);
  const expirationDate = createExpirationDate();
  const securityCode = generateCVC();

  const data = {
      employeeId: body.employeeId,
      number,
      cardholderName: formattedName,
      originalCardId: null,
      password: null,
      securityCode,
      expirationDate,
      isVirtual: false, //Apenas cartões físicos estão sendo gerados
      isBlocked: true,
      type: body.type
  }
  
  await cardRepository.insert(data);
};

export async function activateCard(body, cardId){
  await cardExists(cardId);
  await isCardExpired(cardId);
  await cardAlreadyActivated(cardId);
  await checkSecurityCode(body.securityCode, cardId);
  await checkPassword(body.password);
  await updatePassword(cardId, body.password);
};
