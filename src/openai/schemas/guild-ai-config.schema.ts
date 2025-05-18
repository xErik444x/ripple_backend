import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type GuildAIConfigDocument = GuildAIConfig & Document;

@Schema({ timestamps: true })
export class GuildAIConfig {
  @ApiProperty({
    description: 'ID del servidor de Discord',
    example: '987654321098765432',
  })
  @Prop({ required: true, unique: true })
  guildId: string;

  @ApiProperty({
    description: 'Instrucciones personalizadas para la IA',
    example: 'Actúa como un asistente amigable y responde en español',
    default: '',
  })
  @Prop({ default: '' })
  systemPrompt: string;

  @ApiProperty({
    description: 'Incluir información del canal en las solicitudes a la IA',
    example: false,
    default: false,
  })
  @Prop({ default: false })
  includeChannelContext: boolean;

  @ApiProperty({
    description: 'Incluir información del usuario en las solicitudes a la IA',
    example: false,
    default: false,
  })
  @Prop({ default: false })
  includeUserContext: boolean;

  @ApiProperty({
    description: 'Nombre del modelo de OpenAI a utilizar',
    example: 'gpt-4o',
    default: 'gpt-4o',
  })
  @Prop({ default: 'gpt-4o' })
  modelName: string;

  @ApiProperty({
    description: 'Temperatura para controlar la creatividad de las respuestas',
    example: 0.7,
    default: 0.7,
  })
  @Prop({ default: 0.7 })
  temperature: number;
}

export const GuildAIConfigSchema = SchemaFactory.createForClass(GuildAIConfig);
