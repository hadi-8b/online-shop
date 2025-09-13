// src/contracts/auth/index.ts
export interface LoginFormValuesInterface {
  phone: string
}

export interface RegisterFormValuesInterface {
  first_name: string  
  last_name: string   
  phone: string     
}

export interface PhoneVerifyFormValuesInterface {
  code : string
  phone: string
}