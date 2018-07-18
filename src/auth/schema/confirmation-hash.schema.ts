import { Schema } from 'mongoose';

export const ConfirmationHashSchema = new Schema({
  hash: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' }
});