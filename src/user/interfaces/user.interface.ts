import { RolesEnum } from "../enums/roles.enum";

export interface User {
  id?: Number,
  name: string,
  email: string,
  password: string,
  verified?: Boolean,
  roles?: RolesEnum[],
  createdOn?: Date,
  updatedOn?: Date,
  resetPasswordToken?: string,
  resetPasswordTokenExpiresAt?: Date 
}