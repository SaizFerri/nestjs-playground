import { RolesEnum } from "../enums/roles.enum";

export class UserDto {
  id?: number;
  name: string;
  email: string;
  roles?: RolesEnum[];
  verified?: Boolean;
}