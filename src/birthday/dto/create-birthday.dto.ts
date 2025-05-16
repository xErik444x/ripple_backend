import { IsNotEmpty, IsString, IsDate, IsBoolean, IsOptional } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreateBirthdayDto {
  @ApiProperty({
    description: "ID del usuario de Discord",
    example: "123456789012345678",
  })
  @IsNotEmpty()
  @IsString()
  userId: string

  @ApiProperty({
    description: "Nombre de usuario de Discord",
    example: "JohnDoe#1234",
  })
  @IsNotEmpty()
  @IsString()
  username: string

  @ApiProperty({
    description: "ID del servidor de Discord",
    example: "987654321098765432",
  })
  @IsNotEmpty()
  @IsString()
  guildId: string

  @ApiProperty({
    description: "Fecha de nacimiento",
    example: "2000-01-01T00:00:00.000Z",
  })
  @IsNotEmpty()
  @IsDate()
  birthDate: Date

  @ApiProperty({
    description: "Indica si las notificaciones están habilitadas",
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  notificationEnabled?: boolean
}
