import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Contact } from './entities/contact.entity';
import { AdminContactsController } from './admin-contacts.controller';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contact])],
  controllers: [ContactsController, AdminContactsController],
  providers: [ContactsService, JwtService],
})
export class ContactsModule {}
