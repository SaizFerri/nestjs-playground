import * as mongoose from 'mongoose';

import { RolesEnum } from '../enums/roles.enum';

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true},  
  email: { type: String, unique: true, required: true},
  password: { type: String, required: true },
  verified: { type: Boolean, required: true, default: false },
  roles: { type: [String], default: [] },
  createdOn: { type: Date, default: null },
  updatedOn: { type: Date, default: null },
  resetPasswordToken: { type: String, default: null }
})