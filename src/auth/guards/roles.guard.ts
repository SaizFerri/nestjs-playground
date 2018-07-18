import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import * as jwt from 'jsonwebtoken';
import { includes } from 'lodash';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector){}
  
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<String[]>('roles', context.getHandler());
    
    if (!roles) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const token = request.headers.authorization.split(' ')[1];
    const userRoles = jwt.decode(token).roles;
    const hasRole = () => userRoles.some((role) => includes(roles, role));
  
    return user && userRoles && hasRole();
  }
}