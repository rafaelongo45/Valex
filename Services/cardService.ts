import dayjs from "dayjs";
import Cryptr from "cryptr";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";

import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";

import * as employeeService from "./employeeService.js";

dotenv.config();
export async function APIKeyExists(key){
  const companyRequest = await companyRepository.findByApiKey(key);

  if(!companyRequest){
    throw { type:"APIKey", message: "No company has this API Key", code:400 }
  }
};

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

