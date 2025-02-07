import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BulkDeleteDto } from '@/common/dtos/bulk-delete.dto';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PaginationResponseDto } from '@/common/dtos/pagination-response.dto';

import { SORT_ORDER } from '@/common/constants/order.constant';

import { CONTACT_FIELDS_TO_CREATE_OR_UPDATE, CONTACT_GET_FIELDS, CONTACT_STATUS } from './constants/contacts.constant';
import { CreateContactDto } from './dto/create-contact.dto';
import { FilterContactDto } from './dto/filter-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>
  ) {}

  async create(createDto: CreateContactDto) {
    const newContact = new Contact();

    for (const field of CONTACT_FIELDS_TO_CREATE_OR_UPDATE as string[]) {
      if (createDto[field] !== undefined) {
        newContact[field] = createDto[field];
      }
    }

    newContact.status = CONTACT_STATUS.PUBLISHED;

    const createdContact = await this.contactRepository.save(newContact);

    return createdContact;
  }

  async find(filterDto: FilterContactDto) {
    const { q, order, status, sort, skip, limit } = filterDto;

    const queryBuilder = this.contactRepository.createQueryBuilder('contact');

    queryBuilder.select(CONTACT_GET_FIELDS);
    if (status) queryBuilder.where('contact.status in (:...status)', { status });
    if (q) {
      queryBuilder
        .andWhere('LOWER(contact.name) LIKE LOWER(:name)', { name: `%${q}%` })
        .orWhere('LOWER(contact.email) LIKE LOWER(:email)', { email: `%${q}%` })
        .orWhere('LOWER(contact.message) LIKE LOWER(:message)', { message: `%${q}%` });
    }
    if (sort) {
      if (order) {
        queryBuilder.orderBy(`contact.${sort}`, order);
      } else {
        queryBuilder.orderBy(`contact.${sort}`, SORT_ORDER.DESC);
      }
    } else {
      queryBuilder.orderBy('contact.createdAt', SORT_ORDER.DESC);
    }
    queryBuilder.skip(skip).take(limit);

    const [{ entities }, totalItems] = await Promise.all([queryBuilder.getRawAndEntities(), queryBuilder.getCount()]);
    const paginationDto = new PaginationDto({ totalItems, filterDto });

    return new PaginationResponseDto(entities, { paging: paginationDto });
  }

  async findOne(id: string) {
    const queryBuilder = this.contactRepository.createQueryBuilder('contact');

    queryBuilder.select(CONTACT_GET_FIELDS).where('contact.id = :id', { id });

    const contact = await queryBuilder.getOne();

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    const res = await this.setView(id);

    contact.isRead = res.isRead;

    return contact;
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    const contact = await this.contactRepository.findOneBy({ id });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    Object.assign(contact, updateContactDto);

    const updatedContact = await this.contactRepository.save(contact);

    return updatedContact;
  }

  async remove(id: string) {
    const contact = await this.contactRepository.findOneBy({ id });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    contact.status = CONTACT_STATUS.DELETED;

    const contactResponse = await this.contactRepository.save(contact);

    return contactResponse;
  }

  async bulkDelete(bulkDeleteDto: BulkDeleteDto) {
    const contacts = await this.contactRepository
      .createQueryBuilder('contact')
      .where('contact.id IN (:...ids)', { ids: bulkDeleteDto.ids })
      .orderBy('contact.createdAt', SORT_ORDER.ASC)
      .getMany();

    contacts.forEach(contact => (contact.status = CONTACT_STATUS.DELETED));

    const deletedContacts = await this.contactRepository.save(contacts);

    return deletedContacts;
  }

  private async setView(id: string) {
    const contact = await this.contactRepository.findOneBy({ id });

    contact.isRead = true;

    return this.contactRepository.save(contact);
  }
}
