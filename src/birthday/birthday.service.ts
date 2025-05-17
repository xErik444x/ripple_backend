import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Birthday } from './schemas/birthday.schema';
import { CreateBirthdayDto } from './dto/create-birthday.dto';
import { UpdateBirthdayDto } from './dto/update-birthday.dto';

@Injectable()
export class BirthdayService {
  private readonly logger = new Logger(BirthdayService.name);

  constructor(
    @InjectModel(Birthday.name) private birthdayModel: Model<Birthday>,
  ) {}

  async create(createBirthdayDto: CreateBirthdayDto): Promise<Birthday> {
    try {
      const newBirthday = new this.birthdayModel(createBirthdayDto);
      return await newBirthday.save();
    } catch (error) {
      if (error.code === 11000) {
        // Error de clave duplicada (userId único)
        throw new HttpException(
          'El usuario ya tiene un cumpleaños registrado',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(
    guildId: string,
    page: number = 1,
  ): Promise<{
    birthdays: Birthday[];
    totalBirthdays: number;
    totalPages: number;
    currentPage: number;
  }> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const births = this.birthdayModel
      .find({ guildId })
      .limit(pageSize)
      .skip(skip)
      .exec();
    const totalBirthdays = await this.birthdayModel
      .countDocuments({ guildId })
      .exec();
    const totalPages = Math.ceil(totalBirthdays / pageSize);
    return {
      birthdays: await births,
      totalBirthdays,
      totalPages,
      currentPage: +page,
    };
  }

  async findByUserId(userId: string): Promise<Birthday | null> {
    return this.birthdayModel.findOne({ userId }).exec();
  }

  async update(
    userId: string,
    updateBirthdayDto: UpdateBirthdayDto,
  ): Promise<Birthday | null> {
    try {
      const updated = await this.birthdayModel
        .findOneAndUpdate({ userId }, updateBirthdayDto, { new: true })
        .exec();
      if (!updated) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      return updated;
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException(
          'Datos duplicados al actualizar',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async remove(userId: string): Promise<Birthday | null> {
    try {
      const deleted = await this.birthdayModel
        .findOneAndDelete({ userId })
        .exec();
      if (!deleted) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }
      return deleted;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
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
