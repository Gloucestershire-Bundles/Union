import { Roles } from "@/common/decorators/roles.decorator";
import { Role } from "@/common/enums/role.enum";
import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";

@Controller('/v1/bookings')
export class BookingController {
  constructor(
    private readonly command: CommandBus,
    private readonly query: QueryBus,
  ) {}

  @Post()
  @Roles(Role.USER, Role.VOLUNTEER, Role.ADMINISTRATOR)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body()) {

  }
}