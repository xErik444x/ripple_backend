import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from "@nestjs/common"
import { BirthdayService } from "./birthday.service"
import { CreateBirthdayDto } from "./dto/create-birthday.dto"
import { UpdateBirthdayDto } from "./dto/update-birthday.dto"
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from "@nestjs/swagger"
import { Birthday } from "./schemas/birthday.schema"
import { query } from "express"

@ApiTags("birthdays")
@Controller("birthdays")
@ApiBearerAuth("API-KEY")
export class BirthdayController {
  constructor(private readonly birthdayService: BirthdayService) {}

  @Post()
  @ApiOperation({ summary: "Crear un nuevo registro de cumpleaños" })
  @ApiResponse({ status: 201, description: "Cumpleaños creado exitosamente", type: Birthday })
  @ApiResponse({ status: 400, description: "Datos inválidos" })
  @ApiResponse({ status: 401, description: "No autorizado - API Key inválida" })
  @ApiResponse({ status: 403, description: "Prohibido - IP no autorizada" })
  @ApiResponse({ status: 500, description: "Ese usuario ya existe" })
  @Post()
  create(@Body() createBirthdayDto: CreateBirthdayDto) {
    return this.birthdayService.create(createBirthdayDto);
  }

  @Get()
  @ApiOperation({ summary: "Obtener todos los cumpleaños" })
  @ApiQuery({ name: "guildId", description: "ID del servidor de Discord" })
  @ApiQuery({ name: "page", required: false, description: "Número de página para paginación", type: Number })
  @ApiResponse({ status: 200, description: "Lista de cumpleaños", type: [Birthday] })
  @ApiResponse({ status: 401, description: "No autorizado - API Key inválida" })
  @ApiResponse({ status: 403, description: "Prohibido - IP no autorizada" })
  findAll(
    @Query("guildId") guildId: string,
    @Query("page") page?: number
  ) {
    return this.birthdayService.findAll(guildId, page);
  }

  @Get("upcoming")
  @ApiOperation({ summary: "Obtener próximos cumpleaños de un servidor" })
  @ApiQuery({ name: "guildId", description: "ID del servidor de Discord" })
  @ApiResponse({ status: 200, description: "Lista de próximos cumpleaños", type: [Birthday] })
  @ApiResponse({ status: 401, description: "No autorizado - API Key inválida" })
  @ApiResponse({ status: 403, description: "Prohibido - IP no autorizada" })
  getUpcomingBirthdays(@Query("guildId") guildId: string) {
    return this.birthdayService.getUpcomingBirthdays(guildId);
  }

  @Get("today")
  @ApiOperation({ summary: "Obtener cumpleaños del día actual de un servidor" })
  @ApiQuery({ name: "guildId", description: "ID del servidor de Discord" })
  @ApiResponse({ status: 200, description: "Lista de cumpleaños de hoy", type: [Birthday] })
  @ApiResponse({ status: 401, description: "No autorizado - API Key inválida" })
  @ApiResponse({ status: 403, description: "Prohibido - IP no autorizada" })
  getTodaysBirthdays(@Query("guildId") guildId: string) {
    return this.birthdayService.getTodaysBirthdays(guildId);
  }

  @Get(":userId")
  @ApiOperation({ summary: "Obtener cumpleaños por ID de usuario" })
  @ApiParam({ name: "userId", description: "ID del usuario de Discord" })
  @ApiResponse({ status: 200, description: "Datos del cumpleaños", type: Birthday })
  @ApiResponse({ status: 404, description: "Usuario no encontrado" })
  @ApiResponse({ status: 401, description: "No autorizado - API Key inválida" })
  @ApiResponse({ status: 403, description: "Prohibido - IP no autorizada" })
  findOne(@Param("userId") userId: string) {
    return this.birthdayService.findByUserId(userId);
  }

  @Patch(":userId")
  @ApiOperation({ summary: "Actualizar cumpleaños por ID de usuario" })
  @ApiParam({ name: "userId", description: "ID del usuario de Discord" })
  @ApiResponse({ status: 200, description: "Cumpleaños actualizado", type: Birthday })
  @ApiResponse({ status: 404, description: "Usuario no encontrado" })
  @ApiResponse({ status: 401, description: "No autorizado - API Key inválida" })
  @ApiResponse({ status: 403, description: "Prohibido - IP no autorizada" })
  update(@Param("userId") userId: string, @Body() updateBirthdayDto: UpdateBirthdayDto) {
    return this.birthdayService.update(userId, updateBirthdayDto)
  }

  @Delete(":userId")
  @ApiOperation({ summary: "Eliminar cumpleaños por ID de usuario" })
  @ApiParam({ name: "userId", description: "ID del usuario de Discord" })
  @ApiResponse({ status: 200, description: "Cumpleaños eliminado", type: Birthday })
  @ApiResponse({ status: 404, description: "Usuario no encontrado" })
  @ApiResponse({ status: 401, description: "No autorizado - API Key inválida" })
  @ApiResponse({ status: 403, description: "Prohibido - IP no autorizada" })
  remove(@Param("userId") userId: string) {
    return this.birthdayService.remove(userId);
  }
}
