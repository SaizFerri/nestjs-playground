import * as mongoose from 'mongoose';
import { RolesEnum } from '../enums/roles.enum';

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true},  
  email: { type: String, unique: true, required: true},
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  roles: { type: [String], default: [] },
  resetPasswordToken: { type: String, default: null },
  resetPasswordTokenExpiresAt: { type: Date, default: null } 
})