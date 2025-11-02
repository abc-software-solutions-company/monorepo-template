import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { Contact } from './entities/contact.entity';
import { AdminContactsController } from './admin-contacts.controller';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';

@Module({
  imports: [MikroOrmModule.forFeature([Contact])],
  controllers: [ContactsController, AdminContactsController],
  providers: [ContactsService, JwtService],
})
export class ContactsModule {}
