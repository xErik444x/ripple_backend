import { IsString, IsBoolean, IsOptional, IsNumber, Min, Max } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class UpdateAIConfigDto {
  @ApiProperty({
    description: "Instrucciones personalizadas para la IA (ej. 'Actúa como un pirata')",
    example: "Actúa como un asistente amigable y responde en español",
    required: false,
  })
  @IsOptional()
  @IsString()
  systemPrompt?: string

  @ApiProperty({
    description: "Incluir información del canal en las solicitudes a la IA",
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeChannelContext?: boolean

  @ApiProperty({
    description: "Incluir información del usuario en las solicitudes a la IA",
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  includeUserContext?: boolean

  @ApiProperty({
    description: "Nombre del modelo de OpenAI a utilizar",
    example: "gpt-4o",
    required: false,
  })
  @IsOptional()
  @IsString()
  modelName?: string

  @ApiProperty({
    description: "Temperatura para controlar la creatividad de las respuestas (0-1)",
    example: 0.7,
    minimum: 0,
    maximum: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  temperature?: number
}
