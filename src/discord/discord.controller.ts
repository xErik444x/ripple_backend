import { Controller, Post, Body, Get } from '@nestjs/common';
import { DiscordService } from './discord.service';
import { CommandDto } from './dto/command.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('discord')
@Controller('discord')
@ApiBearerAuth('API-KEY')
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}

  @Post('command')
  @ApiOperation({ summary: 'Ejecutar un comando del bot de Discord' })
  @ApiResponse({ status: 200, description: 'Comando ejecutado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado - API Key inválida' })
  @ApiResponse({ status: 403, description: 'Prohibido - IP no autorizada' })
  @ApiResponse({ status: 500, description: 'Error del servidor' })
  async executeCommand(@Body() commandDto: CommandDto) {
    return this.discordService.processCommand(
      commandDto.command,
      commandDto.params,
    );
  }

  @Public() // Esta ruta es pública, no requiere API Key
  @Get('health')
  @ApiOperation({ summary: 'Verificar el estado del servicio' })
  @ApiResponse({
    status: 200,
    description: 'Servicio funcionando correctamente',
  })
  healthCheck() {
    return { status: 'ok', service: 'discord-bot-backend' };
  }
}
