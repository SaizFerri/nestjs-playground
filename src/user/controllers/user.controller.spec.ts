import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { UserLoginService } from '../services/user-login.service';
import { UserResetPasswordService } from '../services/user-reset-password.service';

describe('UserController', () => {
  let module: TestingModule;
  let userController: UserController;
  let userService: UserService;
  let userLoginService: UserLoginService;
  let userResetPasswordService: UserResetPasswordService;  

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, UserLoginService, UserResetPasswordService]
    }).compile();

    userService = module.get<UserService>(UserService);
    userController = module.get<UserController>(UserController);
    userLoginService = module.get<UserLoginService>(UserLoginService);
    userResetPasswordService = module.get<UserResetPasswordService>(UserResetPasswordService);
  });

  // describe('findAll', () => {
  //   it('should return an array of users', async () => {
  //     jest.spyOn(userService, 'findAll');

  //     expect(await userController.findAll()).toBe();
  //   });
  // });
});
