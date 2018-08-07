import { Injectable, BadRequestException } from "@nestjs/common";
import { Model, ObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ConfirmationHash } from '../interfaces/confirmation-hash.interface';
import * as crypto from 'crypto';
import { ConfigService } from "config/services/config.service";

@Injectable()
export class ConfirmationHashService {
  constructor(
    @InjectModel('ConfirmationHash') private readonly confirmationHashModel: Model<ConfirmationHash>,
    private readonly configService: ConfigService
  ){}

  async findHashById(id: ObjectId): Promise<ConfirmationHash> {
    return await this.confirmationHashModel.findOne({ userId: id });
  }

  async findOneByHash(hash: string): Promise<ConfirmationHash> {
    return await this.confirmationHashModel.findOne({ hash });
  }

  async deleteByHash(hash: string) {
    return await this.confirmationHashModel.deleteOne({ hash });
  }

  async createHash( id: string, email: string): Promise<ConfirmationHash> {
    const confirmationHash = crypto.createHash('sha256').update(email + this.configService.get('SECRET_KEY')).digest('hex');
    const confirmationHashModel = new this.confirmationHashModel({
      hash: confirmationHash,
      userId: id
    });

    try {
      return await this.confirmationHashModel.create(confirmationHashModel);
    } catch(exception) {
      throw new BadRequestException({
        success: false,
        error: "Could not create confirmation hash"
      });
    }
  }
}