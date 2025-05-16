import { PartialType } from "@nestjs/swagger"
import { CreateBirthdayDto } from "./create-birthday.dto"

export class UpdateBirthdayDto extends PartialType(CreateBirthdayDto) {}
