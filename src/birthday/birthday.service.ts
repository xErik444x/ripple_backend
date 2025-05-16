import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Birthday, BirthdayDocument } from './schemas/birthday.schema';
import { CreateBirthdayDto } from './dto/create-birthday.dto';
import { UpdateBirthdayDto } from './dto/update-birthday.dto';

@Injectable()
export class BirthdayService {
  private readonly logger = new Logger(BirthdayService.name);

  constructor(@InjectModel(Birthday.name) private birthdayModel: Model<BirthdayDocument>) {}

  async create(createBirthdayDto: CreateBirthdayDto): Promise<Birthday> {
    const newBirthday = new this.birthdayModel(createBirthdayDto);
    return newBirthday.save();
  }

  async findAll(): Promise<Birthday[]> {
    return this.birthdayModel.find().exec();
  }

  async findByUserId(userId: string): Promise<Birthday | null> {
    return this.birthdayModel.findOne({ userId }).exec();
  }

  async update(
    userId: string,
    updateBirthdayDto: UpdateBirthdayDto,
  ): Promise<Birthday | null> {
    return this.birthdayModel
      .findOneAndUpdate({ userId }, updateBirthdayDto, { new: true })
      .exec();
  }

  async remove(userId: string): Promise<Birthday | null> {
    return this.birthdayModel.findOneAndDelete({ userId }).exec();
  }

  async getUpcomingBirthdays(guildId: string): Promise<Birthday[]> {
    const today = new Date();
    const oneMonthLater = new Date();
    oneMonthLater.setMonth(today.getMonth() + 1);

    // Buscar cumpleaños en el próximo mes
    return this.birthdayModel
      .find({
        guildId,
        $expr: {
          $and: [
            { $gte: [{ $month: '$birthDate' }, today.getMonth() + 1] },
            { $lte: [{ $month: '$birthDate' }, oneMonthLater.getMonth() + 1] },
          ],
        },
      })
      .sort({ 'birthDate.month': 1, 'birthDate.day': 1 })
      .exec();
  }

  async getTodaysBirthdays(guildId: string): Promise<Birthday[]> {
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // MongoDB months are 1-12
    const currentDay = today.getDate();

    // Buscar cumpleaños que coincidan con el día y mes actuales
    return this.birthdayModel
      .find({
        guildId,
        $expr: {
          $and: [
            { $eq: [{ $month: '$birthDate' }, currentMonth] },
            { $eq: [{ $dayOfMonth: '$birthDate' }, currentDay] },
          ],
        },
      })
      .exec();
  }
}
