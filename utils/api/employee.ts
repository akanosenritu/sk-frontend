export type APIEmployee =  {
  uuid: string,
  last_name: string,
  last_name_kana: string,
  first_name: string,
  first_name_kana: string
}

export const convertAPIEmployeeToEmployee = (apiEmployee: APIEmployee): Employee => {
  return {
    ...apiEmployee,
    lastName: apiEmployee.last_name,
    lastNameKana: apiEmployee.last_name_kana,
    firstName: apiEmployee.first_name,
    firstNameKana: apiEmployee.first_name_kana
  }
}

export const convertEmployeeToAPIEmployee = (employee: Employee): APIEmployee => {
  return {
    ...employee,
    last_name: employee.lastName,
    last_name_kana: employee.lastNameKana,
    first_name: employee.firstName,
    first_name_kana: employee.firstNameKana
  }
}