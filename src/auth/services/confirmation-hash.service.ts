import { Injectable, BadRequestException } from "@nestjs/common";
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfirmationHash } from '../interfaces/confirmation-hash.interface';
import * as crypto from 'crypto';

@Injectable()
export class ConfirmationHashService {
  constructor(@InjectModel('ConfirmationHash') private readonly confirmationHashModel: Model<ConfirmationHash>){}

  async findHashById(id: string): Promise<ConfirmationHash> {
    return await this.confirmationHashModel.findOne({ userId: id });
  }

  async findOneByHash(hash: string): Promise<ConfirmationHash> {
    return await this.confirmationHashModel.findOne({ hash });
  }

  async deleteByHash(hash: string) {
    return await this.confirmationHashModel.deleteOne({ hash });
  }

  async createHash( id: string, email: string) {
    const confirmationHash = crypto.createHash('sha256').update(email).digest('hex');
    const confirmationHashModel = new this.confirmationHashModel({
      hash: confirmationHash,
      userId: id
    });

    try {
      await this.confirmationHashModel.create(confirmationHashModel);
    } catch(exception) {
      throw new BadRequestException();
    }
  }
}