import { RolesEnum } from "../enums/roles.enum";

export class UserDto {
  name: string;
  email: string;
  roles: RolesEnum[];
  verified: Boolean;
}