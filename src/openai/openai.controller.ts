import { Controller, Post, Body, HttpException, HttpStatus, Get, Param, Patch } from "@nestjs/common"
import { OpenaiService } from "./openai.service"
import { UpdateAIConfigDto } from "./dto/update-ai-config.dto"
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from "@nestjs/swagger"
import { GuildAIConfig } from "./schemas/guild-ai-config.schema"

@ApiTags("openai")
@Controller("openai")
@ApiBearerAuth("API-KEY")
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('generate')
  @ApiOperation({ summary: "Generar respuesta de OpenAI" })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', example: "¿Cuál es la capital de Francia?" },
        guildId: { type: 'string', example: "987654321098765432" },
        contextInfo: {
          type: 'object',
          properties: {
            channelName: { type: 'string', example: "general" },
            channelId: { type: 'string', example: "123456789012345678" },
            userName: { type: 'string', example: "JohnDoe" },
            userId: { type: 'string', example: "123456789012345678" }
          }
        }
      },
      required: ['prompt']
    }
  })
  @ApiResponse({ status: 200, description: "Respuesta generada exitosamente" })
  @ApiResponse({ status: 400, description: "Datos inválidos" })
  @ApiResponse({ status: 401, description: "No autorizado - API Key inválida" })
  @ApiResponse({ status: 403, description: "Prohibido - IP no autorizada" })
  @ApiResponse({ status: 500, description: "Error del servidor" })
  async generateResponse(
    @Body()
    body: {
      prompt: string;
      guildId?: string;
      contextInfo?: {
        channelName?: string;
        channelId?: string;
        userName?: string;
        userId?: string;
      };
    },
  ) {
    try {
      const { prompt, guildId, contextInfo } = body;

      if (!prompt) {
        throw new HttpException('El prompt es requerido', HttpStatus.BAD_REQUEST);
      }

      const response = await this.openaiService.generateResponse(prompt, guildId, contextInfo);
      return { response };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al generar respuesta',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('config/:guildId')
  @ApiOperation({ summary: "Obtener configuración de IA de un servidor" })
  @ApiParam({ name: "guildId", description: "ID del servidor de Discord" })
  @ApiResponse({ status: 200, description: "Configuración obtenida exitosamente", type: GuildAIConfig })
  @ApiResponse({ status: 401, description: "No autorizado - API Key inválida" })
  @ApiResponse({ status: 403, description: "Prohibido - IP no autorizada" })
  @ApiResponse({ status: 500, description: "Error del servidor" })
  async getGuildConfig(@Param('guildId') guildId: string) {
    try {
      const config = await this.openaiService.getOrCreateGuildConfig(guildId);
      return config;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al obtener configuración',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch("config/:guildId")
  @ApiOperation({ summary: "Actualizar configuración de IA de un servidor" })
  @ApiParam({ name: "guildId", description: "ID del servidor de Discord" })
  @ApiResponse({ status: 200, description: "Configuración actualizada exitosamente", type: GuildAIConfig })
  @ApiResponse({ status: 400, description: "Datos inválidos" })
  @ApiResponse({ status: 401, description: "No autorizado - API Key inválida" })
  @ApiResponse({ status: 403, description: "Prohibido - IP no autorizada" })
  @ApiResponse({ status: 500, description: "Error del servidor" })
  async updateGuildConfig(@Param('guildId') guildId: string, @Body() updateDto: UpdateAIConfigDto) {
    try {
      const updatedConfig = await this.openaiService.updateGuildAIConfig(guildId, updateDto)
      return updatedConfig
    } catch (error) {
      throw new HttpException(error.message || "Error al actualizar configuración", HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
