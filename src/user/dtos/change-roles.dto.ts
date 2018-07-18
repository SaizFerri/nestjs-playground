import { RolesEnum } from "../enums/roles.enum";

export class ChangeRolesDto {
  readonly id: string;
  readonly roles: RolesEnum[];
}