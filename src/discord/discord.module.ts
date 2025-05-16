import { Module } from "@nestjs/common"
import { DiscordService } from "./discord.service"
import { DiscordController } from "./discord.controller"
import { BirthdayModule } from "../birthday/birthday.module"
import { OpenaiModule } from "../openai/openai.module"

@Module({
  imports: [BirthdayModule, OpenaiModule],
  controllers: [DiscordController],
  providers: [DiscordService],
  exports: [DiscordService],
})
export class DiscordModule {}
