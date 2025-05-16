import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ConfigModule } from "@nestjs/config"
import { OpenaiService } from "./openai.service"
import { OpenaiController } from "./openai.controller"
import { GuildAIConfig, GuildAIConfigSchema } from "./schemas/guild-ai-config.schema"

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: GuildAIConfig.name, schema: GuildAIConfigSchema }])
  ],
  controllers: [OpenaiController],
  providers: [OpenaiService],
  exports: [OpenaiService],
})
export class OpenaiModule {}
