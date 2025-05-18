import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type BirthdayDocument = Birthday & Document;

@Schema({ timestamps: true })
export class Birthday {
  @ApiProperty({
    description: 'ID del usuario de Discord',
    example: '123456789012345678',
  })
  @Prop({ required: true })
  userId: string;

  @ApiProperty({
    description: 'Nombre de usuario de Discord',
    example: 'JohnDoe#1234',
  })
  @Prop({ required: true })
  username: string;

  @ApiProperty({
    description: 'ID del servidor de Discord',
    example: '987654321098765432',
  })
  @Prop({ required: true })
  guildId: string;

  @ApiProperty({
    description: 'Fecha de nacimiento',
    example: '2000-01-01T00:00:00.000Z',
  })
  @Prop({ required: true })
  birthDate: Date;

  @ApiProperty({
    description: 'Indica si las notificaciones están habilitadas',
    example: true,
    default: false,
  })
  @Prop()
  notificationEnabled: boolean;
}

export const BirthdaySchema = SchemaFactory.createForClass(Birthday);

// Asegura el índice único en userId y guildId (compuesto)
BirthdaySchema.index({ userId: 1, guildId: 1 }, { unique: true });

// Índice para búsquedas por guildId
BirthdaySchema.index({ guildId: 1 });

// Índice compuesto para búsquedas por guildId y birthDate
BirthdaySchema.index({ guildId: 1, birthDate: 1 });
