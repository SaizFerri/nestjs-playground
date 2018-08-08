import { Controller, Get, Post, Body, UseGuards, Put, Param, Delete } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user.interface';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';

import { UserLoginService } from '../services/user-login.service';
import { UserResetPasswordService } from '../services/user-reset-password.service';

import { ChangeRolesDto } from '../dtos/change-roles.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserLoginDto } from '../dtos/user-login.dto';
import { TokenDto } from '../dtos/token-dto';
import { VerifyHashDto } from '../dtos/verify-hash.dto';
import { EmailDto } from '../dtos/email.dto';

import { RolesEnum } from '../enums/roles.enum';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userLoginService: UserLoginService,
    private readonly userResetPasswordService: UserResetPasswordService
  ){}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RolesEnum.Admin)
  async findAll():  Promise<User[]> {
    return await this.userService.findAll();
  }

  @Post('/login')
  async login(@Body() user: UserLoginDto): Promise<TokenDto> {
    return await this.userLoginService.login(user);
  }

  @Post('/register')
  async createUser(@Body() user: CreateUserDto) {
    return await this.userService.createUser(user);
  }
  
  @Post('/resetPassword')
  async createResetPasswordToken(@Body() params: EmailDto) {
    return await this.userResetPasswordService.createResetPasswordToken(params);
  }

  @Put('/resetPassword')
  async resetPassword(@Body() params: ResetPasswordDto) {
    return await this.userResetPasswordService.resetPassword(params);
  }

  @Put('roles')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RolesEnum.User)
  async addRoles(@Body() params: ChangeRolesDto) {
    return await this.userService.addRoles(params);
  }

  @Delete('roles')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RolesEnum.Admin)
  async removeRole(@Body() params: ChangeRolesDto) {
    return await this.userService.removeRole(params);
  }

  @Put('/verify')
  async verifyAccount(@Body() params: VerifyHashDto): Promise<User> {
    return await this.userService.verifyAccount(params);
  }

  @Post('/resendVerificationEmail')
  async resendVerificationEmail(@Body() params: EmailDto) {
    return this.userService.resendVerificationEmail(params);
  }
}
