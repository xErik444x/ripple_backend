import { IsNotEmpty, IsString, IsObject } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CommandDto {
  @ApiProperty({
    description: "Comando a ejecutar",
    example: "gpt",
    enum: ["birthday", "todaysBirthdays", "gpt", "aiConfig"],
  })
  @IsNotEmpty()
  @IsString()
  command: string

  @ApiProperty({
    description: "Parámetros del comando",
    example: {
      prompt: "¿Cuál es la capital de Francia?",
      guildId: "987654321098765432",
      userId: "123456789012345678",
      channelName: "general",
    },
  })
  @IsNotEmpty()
  @IsObject()
  params: Record<string, any>
}
