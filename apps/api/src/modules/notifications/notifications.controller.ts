import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { NotificationsService } from '@/notifications/notifications.service';
import { CreateNotificationDto } from '@/notifications/dtos/create-notification.dto';
import { Roles } from '@/common/decorators/roles.decorator';
import { Role } from '@/common/enums/role.enum';
import { Request } from 'express';
import { ClerkUser } from '@/auth/interfaces/clerk-user.interface';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('/v1/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @Roles(Role.ADMINISTRATOR, Role.VOLUNTEER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new notification' })
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get('my')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user notifications' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  async findMy(
    @Req() req: Request,
    @Query('limit') limit: string = '50',
    @Query('skip') skip: string = '0',
  ) {
    const user = req.user as ClerkUser;
    return this.notificationsService.findByRecipient(
      user.id,
      parseInt(limit),
      parseInt(skip),
    );
  }

  @Get('my/unread')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user unread notifications' })
  async findMyUnread(@Req() req: Request) {
    const user = req.user as ClerkUser;
    return this.notificationsService.findUnreadByRecipient(user.id);
  }

  @Get('my/count')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get current user unread notification count' })
  async getUnreadCount(@Req() req: Request) {
    const user = req.user as ClerkUser;
    const count = await this.notificationsService.getUnreadCount(user.id);
    return { count };
  }

  @Get()
  @Roles(Role.ADMINISTRATOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all notifications (admin only)' })
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get notification by ID' })
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(id);
  }

  @Patch(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Patch('my/read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Mark all user notifications as read' })
  async markAllAsRead(@Req() req: Request) {
    const user = req.user as ClerkUser;
    await this.notificationsService.markAllAsRead(user.id);
  }

  @Delete(':id')
  @Roles(Role.ADMINISTRATOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete notification (admin only)' })
  remove(@Param('id') id: string) {
    return this.notificationsService.delete(id);
  }
}