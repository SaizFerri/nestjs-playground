import { Model } from 'mongoose';
import { User } from '../interfaces/user.interface';
import { RolesEnum } from '../enums/roles.enum';
import { ChangeRolesDto } from '../dtos/change-roles.dto';
import { Injectable, HttpException, HttpStatus, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { includes } from 'lodash';
import { ConfirmationHashService } from 'auth/services/confirmation-hash.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as EmailValidator from 'email-validator';
import * as moment from 'moment';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly confirmationHashService: ConfirmationHashService
  ){}

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOneById(id: String): Promise<User> {
    return await this.userModel.findOne({ _id: id });
  }

  async findOneByEmail(email: String): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  /**
   * Function which takes an id and a role as parameter
   * and adds or deletes the user role.
   * @throws BadRequestException
   * @param params 
   */
  async addRoles(params: ChangeRolesDto): Promise<RolesEnum[]> {
    const user = await this.findOneById(params.id);
    
    if (user === null) {
      throw new UnauthorizedException();
    }

    const userRoles = [...user.roles];
    
    // If role is not in RolesEnum throw bad request exception
    params.roles.forEach((role) => {
      if (!(<any>Object).values(RolesEnum).includes(role) || includes(userRoles, role)) {
        throw new BadRequestException();
      }
    });
    
    userRoles.push(...params.roles);
    
    // If it doesn't have the role, add it
    try {
      await this.userModel.update({ _id: params.id }, { roles: userRoles});
      return userRoles;
    } catch(exception) {
      throw new NotFoundException();
    }
  }

  /**
   * Deletes a Role passed in the params.roles
   * @throws BadRequestException
   * @param params 
   */
  async removeRole(params: ChangeRolesDto): Promise<RolesEnum[]> {
    const user = await this.findOneById(params.id);
    const role = params.roles[0];
    
    if (user === null) {
      throw new UnauthorizedException();
    }

    const userRoles = [...user.roles];

    // If role is not in RolesEnum or the role is "user" throw bad request exception
    if (!(<any>Object).values(RolesEnum).includes(role)
       || params.roles.length > 1 
       || role === RolesEnum.User 
       || !includes(userRoles, role))
    {
      throw new BadRequestException();
    }

    const index = userRoles.indexOf(role, 0);

    if (index > -1) {
      userRoles.splice(index, 1);
    }

    try {
      await this.userModel.update({ _id: params.id }, { roles: userRoles });
      return userRoles;
    } catch(exception) {
      throw new NotFoundException();
    }
  }

  /**
   * Create a user and a confirmation hash to verify the account
   * @param user 
   */
  async createUser(user: CreateUserDto) {
    const { name, email, password, repeatPassword } = user;
    const saltRounds = 10;

    if (!EmailValidator.validate(email) || password !== repeatPassword) {
      throw new HttpException('User not created', HttpStatus.BAD_REQUEST);
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const createdOn = moment.utc(Date.now());
    const userModel = new this.userModel({
      name,
      email,
      password: hash,
      createdOn
    });

    try {
      const { _id, name, email } = await this.userModel.create(userModel);
      await this.confirmationHashService.createHash(_id, email);
      return {
        _id,
        name,
        email
      };
      
    } catch(exception) {
      throw new HttpException('User not created', HttpStatus.BAD_REQUEST);
    }
  }

  async verifyAccount(hash: string): Promise<User> {
    const confirmationHash = await this.confirmationHashService.findOneByHash(hash);
    const updatedOn = moment.utc(Date.now());

    if (confirmationHash === null) {
      throw new NotFoundException();
    }
    const userId = confirmationHash.userId;
    
    try {
      await this.userModel.updateOne({ _id: userId}, { verified: true, roles: [RolesEnum.User], updatedOn });
    } catch (error) {
      throw new UnauthorizedException();
    }
    
    await this.confirmationHashService.deleteByHash(confirmationHash.hash);

    return await this.findOneById(userId);
  }
}
