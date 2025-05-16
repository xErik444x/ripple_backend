import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { BirthdayService } from "./birthday.service"
import { BirthdayController } from "./birthday.controller"
import { Birthday, BirthdaySchema } from "./schemas/birthday.schema"

@Module({
  imports: [MongooseModule.forFeature([{ name: Birthday.name, schema: BirthdaySchema }])],
  controllers: [BirthdayController],
  providers: [BirthdayService],
  exports: [BirthdayService],
})
export class BirthdayModule {}
