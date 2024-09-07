import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Messaging, MulticastMessage } from 'firebase-admin/messaging';
import { PinoLogger } from 'nestjs-pino';

import { CreateNotificationDto } from './dto/create-notification.dto';
import { SendNotificationDto } from './dto/send-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

import { UsersService } from '../users/users.service';

@Injectable()
export class NotificationsService {
  private messaging: Messaging;

  constructor(
    private readonly logger: PinoLogger,
    private readonly usersService: UsersService
  ) {
    this.logger.setContext(NotificationsService.name);
    try {
      this.messaging = admin.messaging();
    } catch (error) {
      this.logger.error(`Error initializing Firebase Messaging: ${error.message}`);
    }
  }

  async sendNotification(sendDto: SendNotificationDto) {
    const deviceTokens = await this.usersService.getAllDeviceTokens();

    const message: MulticastMessage = {
      tokens: deviceTokens,
      notification: {
        title: sendDto.title,
        body: sendDto.content,
      },
      android: {
        notification: {
          priority: 'high',
          sound: sendDto.sound ? 'default' : undefined,
          channelId: sendDto.channelId,
        },
      },
    };

    try {
      await this.messaging.sendEachForMulticast(message);
      this.logger.info(`Push notification sent to tokens`);
    } catch (error) {
      this.logger.error(`Error sending push notification: ${error.message}`);
      throw new InternalServerErrorException('Failed to send push notification');
    }
  }

  create(_createDto: CreateNotificationDto) {
    return 'This action adds a new notification';
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, _updateDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
