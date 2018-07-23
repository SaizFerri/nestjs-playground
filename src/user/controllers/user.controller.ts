import { Controller, Get, Post, Body, UseGuards, Put, Param, Delete } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user.interface';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'auth/decorators/roles.decorator';
import { RolesGuard } from 'auth/guards/roles.guard';
import { UserLoginService } from '../services/user-login.service';
import { ChangeRolesDto } from '../dtos/change-roles.dto';
import { RolesEnum } from '../enums/roles.enum';
import { UserResetPasswordService } from '../services/user-reset-password.service';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserLoginDto } from '../dtos/user-login.dto';

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
  async login(@Body() user: UserLoginDto): Promise<String> {
    return await this.userLoginService.login(user);
  }

  @Post('/register')
  async createUser(@Body() user: CreateUserDto) {
    return await this.userService.createUser(user);
  }
  
  @Post('/resetPassword')
  async createResetPasswordToken(@Body() email): Promise<String> {
    return await this.userResetPasswordService.createResetPasswordToken(email);
  }

  @Put('/resetPassword/:token')
  async resetPassword(@Param('token') token, @Body() params: ResetPasswordDto) {
    return await this.userResetPasswordService.resetPassword(token, params);
  }

  @Put('roles')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RolesEnum.Admin)
  async addRoles(@Body() params: ChangeRolesDto) {
    return await this.userService.addRoles(params);
  }

  @Delete('roles')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(RolesEnum.Admin)
  async removeRole(@Body() params: ChangeRolesDto) {
    return await this.userService.removeRole(params);
  }

  @Put('/verify/:hash')
  async verifyAccount(@Param('hash') hash): Promise<User> {
    return await this.userService.verifyAccount(hash);
  }
}
