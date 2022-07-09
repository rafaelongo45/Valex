import * as employeeRepository from "../repositories/employeeRepository.js";

export async function employeeExists(id: number){
  const employee = await employeeRepository.findById(id);
  if(!employee){
    throw { type: "employeeError", message: "Employee doesn't exist", code: 404};
  }
};

export function formatEmployeeName(name: string){ //TODO: There is a simpler way to get the same result and is easier to understand
  let formattedName: string = "";
  const nameArray: string[] = name.toUpperCase().split(' ');

  for(let i = 0; i < nameArray.length; i++){
    if (i === 0){
      formattedName += nameArray[i];
    } else if(i === nameArray.length - 1){
      formattedName += " " + nameArray[i];
    }else if(nameArray[i].length >= 3){
      formattedName += " " + nameArray[i][0];
    }
  };

  return formattedName;
}