import * as cardRepository from "../repositories/cardRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";

import * as employeeService from "./employeeService.js";

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

export async function createUserCard(body){
  await employeeService.employeeExists(body.employeeId);
  await checkCardType(body.type, body.employeeId);
  const formattedName = employeeService.formatEmployeeName(body.cardholderName);
  await cardRepository.insert(body);
};


