import { Controller, Get, Post, Body, UseGuards, Put, Param, Delete, NotFoundException } from '@nestjs/common';
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
import { UserDto } from '../dtos/user.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userLoginService: UserLoginService,
    private readonly userResetPasswordService: UserResetPasswordService
  ){}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RolesEnum.ADMIN)
  async findAll():  Promise<UserDto[]> {
    const users =  await this.userService.findAll();
    const newUsers = users.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        verified: user.verified
      }
    });
    return newUsers;
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RolesEnum.ADMIN)
  async findOne(@Param('id') _id):  Promise<UserDto> {
    const { id, name, email, roles, verified } = await this.userService.findOneById(_id);
    return {
      id,
      name,
      email,
      roles,
      verified
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RolesEnum.ADMIN)
  async updateOne(@Param('id') _id, @Body() params: UserDto):  Promise<User> {
    return await this.userService.updateOne(_id, params);
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
  @Roles(RolesEnum.ADMIN)
  async addRoles(@Body() params: ChangeRolesDto) {
    return await this.userService.updateRoles(params);
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
