import { findByApiKey } from "../repositories/companyRepository.js";

export async function APIKeyExists(key){
  const companyRequest = await findByApiKey(key);
  console.log(companyRequest)

  if(!companyRequest){
    throw {type:"APIKey", message: "No company has this API Key", code:400}
  }
}