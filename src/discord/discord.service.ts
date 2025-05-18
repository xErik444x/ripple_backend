import { Injectable, Logger } from '@nestjs/common';
import { BirthdayService } from '../birthday/birthday.service';
import { OpenaiService } from '../openai/openai.service';
import { UpdateAIConfigDto } from 'src/openai/dto/openai.dto';

@Injectable()
export class DiscordService {
  private readonly logger = new Logger(DiscordService.name);

  constructor(
    private readonly birthdayService: BirthdayService,
    private readonly openaiService: OpenaiService,
  ) {}

  async handleBirthdayCommand(userId: string, guildId: string) {
    try {
      const birthdays =
        await this.birthdayService.getUpcomingBirthdays(guildId);
      return birthdays;
    } catch (error) {
      this.logger.error(
        `Error al obtener cumpleaños: ${(error as Error).message}`,
      );
      throw error;
    }
  }

  async handleTodaysBirthdaysCommand(guildId: string) {
    try {
      const todaysBirthdays =
        await this.birthdayService.getTodaysBirthdays(guildId);
      return todaysBirthdays;
    } catch (error) {
      this.logger.error(
        `Error al obtener cumpleaños de hoy: ${(error as Error).message}`,
      );
      throw error;
    }
  }

  async handleGptCommand(
    prompt: string,
    guildId: string,
    contextInfo?: {
      channelName?: string;
      channelId?: string;
      userName?: string;
      userId?: string;
    },
  ) {
    try {
      const response = await this.openaiService.generateResponse(
        prompt,
        guildId,
        contextInfo,
      );
      return response;
    } catch (error) {
      this.logger.error(
        `Error al generar respuesta GPT: ${(error as Error).message}`,
      );
      throw error;
    }
  }

  async handleAIConfigCommand(
    guildId: string,
    action: 'get' | 'update',
    updateData?: UpdateAIConfigDto,
  ) {
    try {
      if (action === 'get') {
        return await this.openaiService.getOrCreateGuildConfig(guildId);
      } else if (action === 'update' && updateData) {
        return await this.openaiService.updateGuildAIConfig(
          guildId,
          updateData,
        );
      }
      throw new Error('Acción no válida');
    } catch (error) {
      this.logger.error(
        `Error en configuración de IA: ${(error as Error).message}`,
      );
      throw error;
    }
  }

  // Método para recibir comandos desde el bot de Discord (provisional)
  async processCommand(command: string, params: Record<string, string>) {
    switch (command) {
      case 'birthday':
        return this.handleBirthdayCommand(params.userId, params.guildId);
      case 'todaysBirthdays':
        return this.handleTodaysBirthdaysCommand(params.guildId);
      case 'gpt':
        return this.handleGptCommand(params.prompt, params.guildId, {
          channelName: params.channelName,
          channelId: params.channelId,
          userName: params.userName,
          userId: params.userId,
        });
      case 'aiConfig':
        return this.handleAIConfigCommand(
          params.guildId,
          params.action as 'get' | 'update',
          params.updateData as UpdateAIConfigDto,
        );
      default:
        return { message: 'Comando no reconocido' };
    }
  }
}
