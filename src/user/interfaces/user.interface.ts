import { RolesEnum } from "../enums/roles.enum";

export interface User {
  id?: number,
  name: string,
  email: string,
  password: string,
  verified?: boolean,
  roles?: RolesEnum[],
  createdOn?: Date,
  updatedOn?: Date,
  resetPasswordToken?: string,
}