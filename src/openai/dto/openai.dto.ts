import {
  IsString,
  IsBoolean,
  IsOptional,
  IsNumber,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ContextInfoDto {
  @ApiProperty({
    description: 'Nombre del canal',
    example: 'general',
    required: false,
  })
  @IsOptional()
  @IsString()
  channelName?: string;

  @ApiProperty({
    description: 'ID del canal',
    example: '123456789012345678',
    required: false,
  })
  @IsOptional()
  @IsString()
  channelId?: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'JohnDoe',
    required: false,
  })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiProperty({
    description: 'ID del usuario',
    example: '123456789012345678',
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

export class GenerateRequestDto {
  @ApiProperty({
    description: 'Prompt para la IA',
    example: '¿Cuál es la capital de Francia?',
  })
  @IsString()
  prompt: string;

  @ApiProperty({
    description: 'ID del servidor de Discord',
    example: '987654321098765432',
    required: false,
  })
  @IsOptional()
  @IsString()
  guildId?: string;

  @ApiProperty({
    description: 'Información contextual',
    type: ContextInfoDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ContextInfoDto)
  contextInfo?: ContextInfoDto;
}

export class UpdateAIConfigDto {
  @ApiProperty({
    description:
      "Instrucciones personalizadas para la IA (ej. 'Actúa como un pirata')",
    example: 'Actúa como un asistente amigable y responde en español',
    required: false,
  })
  @IsOptional()
  @IsString()
  systemPrompt?: string;

  @ApiProperty({
    description: 'Incluir información del canal en las solicitudes a la IA',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeChannelContext?: boolean;

  @ApiProperty({
    description: 'Incluir información del usuario en las solicitudes a la IA',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeUserContext?: boolean;

  @ApiProperty({
    description: 'Nombre del modelo de OpenAI a utilizar',
    example: 'gpt-4o',
    required: false,
  })
  @IsOptional()
  @IsString()
  modelName?: string;

  @ApiProperty({
    description:
      'Temperatura para controlar la creatividad de las respuestas (0-1)',
    example: 0.7,
    minimum: 0,
    maximum: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  temperature?: number;
}
