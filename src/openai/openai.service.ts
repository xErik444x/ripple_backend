import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { GuildAIConfig } from './schemas/guild-ai-config.schema';
import { UpdateAIConfigDto } from './dto/openai.dto';

@Injectable()
export class OpenaiService {
  private readonly logger = new Logger(OpenaiService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(GuildAIConfig.name)
    private guildAIConfigModel: Model<GuildAIConfig>,
  ) {}

  async generateResponse(
    prompt: string,
    guildId?: string,
    contextInfo?: {
      channelName?: string;
      channelId?: string;
      userName?: string;
      userId?: string;
    },
  ): Promise<string> {
    try {
      const apiKey = this.configService.get<string>('OPENAI_API_KEY');

      if (!apiKey) {
        throw new Error('OPENAI_API_KEY no está configurada');
      }

      let finalPrompt = prompt;
      let systemPrompt = '';
      let modelName = 'gpt-4.1-mini';
      let temperature = 0.7;

      if (guildId) {
        const guildConfig = await this.getOrCreateGuildConfig(guildId);

        if (guildConfig.systemPrompt) {
          systemPrompt = guildConfig.systemPrompt;
        }

        if (guildConfig.modelName) {
          modelName = guildConfig.modelName;
        }

        if (guildConfig.temperature !== undefined) {
          temperature = guildConfig.temperature;
        }

        if (contextInfo) {
          let contextualInfo = '';

          if (guildConfig.includeChannelContext && contextInfo.channelName) {
            contextualInfo += `[Estás en el canal: ${contextInfo.channelName} (ID: ${contextInfo.channelId})] `;
          }

          if (guildConfig.includeUserContext && contextInfo.userName) {
            contextualInfo += `[Te escribió: ${contextInfo.userName} (ID: ${contextInfo.userId})] `;
          }

          if (contextualInfo) {
            finalPrompt = `${contextualInfo}\n\n${prompt}`;
          }
        }
      }

      const { text } = await generateText({
        model: openai(modelName),
        prompt: finalPrompt,
        system: systemPrompt || undefined,
        temperature: temperature,
      });

      return text;
    } catch (error) {
      this.logger.error(
        `Error al generar respuesta de OpenAI: ${error.message}`,
      );
      throw error;
    }
  }

  async getGuildConfig(guildId: string): Promise<GuildAIConfig | null> {
    return this.guildAIConfigModel.findOne({ guildId }).exec();
  }

  async getOrCreateGuildConfig(guildId: string): Promise<GuildAIConfig> {
    let config = await this.getGuildConfig(guildId);

    if (!config) {
      config = await this.guildAIConfigModel.create({ guildId });
    }

    return config;
  }

  async updateGuildAIConfig(
    guildId: string,
    updateDto: UpdateAIConfigDto,
  ): Promise<GuildAIConfig | null> {
    return this.guildAIConfigModel
      .findOneAndUpdate({ guildId }, updateDto, { new: true })
      .exec();
  }
}
