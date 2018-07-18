import { RolesEnum } from "../enums/roles.enum";

export interface User {
  id?: Number,
  name: string,
  email: string,
  password: string,
  verified?: Boolean,
  roles?: RolesEnum[],
  resetPasswordToken?: string,
  resetPasswordTokenExpiresAt?: Date 
}