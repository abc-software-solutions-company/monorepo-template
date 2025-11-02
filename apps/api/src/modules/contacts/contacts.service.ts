import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';

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
    private readonly contactRepository: EntityRepository<Contact>,
    private readonly em: EntityManager
  ) {}

  async create(createDto: CreateContactDto) {
    const newContact = new Contact();

    for (const field of CONTACT_FIELDS_TO_CREATE_OR_UPDATE as string[]) {
      if (createDto[field] !== undefined) {
        newContact[field] = createDto[field];
      }
    }

    newContact.status = CONTACT_STATUS.PUBLISHED;

    await this.em.persistAndFlush(newContact);

    return newContact;
  }

  async find(filterDto: FilterContactDto) {
    const { q, order, status, sort, skip, limit } = filterDto;

    const queryBuilder = this.contactRepository.createQueryBuilder('contact');

    queryBuilder.select(CONTACT_GET_FIELDS);
    if (status) queryBuilder.where({ status: { $in: status } });
    if (q) {
      queryBuilder.andWhere({
        $or: [
          { name: { $ilike: `%${q}%` } },
          { email: { $ilike: `%${q}%` } },
          { message: { $ilike: `%${q}%` } },
        ],
      });
    }
    if (sort) {
      if (order) {
        queryBuilder.orderBy({ [sort]: order });
      } else {
        queryBuilder.orderBy({ [sort]: SORT_ORDER.DESC });
      }
    } else {
      queryBuilder.orderBy({ createdAt: SORT_ORDER.DESC });
    }
    queryBuilder.offset(skip).limit(limit);

    const [entities, totalItems] = await queryBuilder.getResultAndCount();
    const paginationDto = new PaginationDto({ totalItems, filterDto });

    return new PaginationResponseDto(entities, { paging: paginationDto });
  }

  async findOne(id: string) {
    const queryBuilder = this.contactRepository.createQueryBuilder('contact');

    queryBuilder.select(CONTACT_GET_FIELDS).where({ id });

    const contact = await queryBuilder.getSingleResult();

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    const res = await this.setView(id);

    contact.isRead = res.isRead;

    return contact;
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    const contact = await this.contactRepository.findOne({ id });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    Object.assign(contact, updateContactDto);

    await this.em.flush();

    return contact;
  }

  async remove(id: string) {
    const contact = await this.contactRepository.findOne({ id });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    contact.status = CONTACT_STATUS.DELETED;

    await this.em.flush();

    return contact;
  }

  async bulkDelete(bulkDeleteDto: BulkDeleteDto) {
    const contacts = await this.contactRepository
      .createQueryBuilder('contact')
      .where({ id: { $in: bulkDeleteDto.ids } })
      .orderBy({ createdAt: SORT_ORDER.ASC })
      .getResult();

    contacts.forEach(contact => (contact.status = CONTACT_STATUS.DELETED));

    await this.em.flush();

    return contacts;
  }

  private async setView(id: string) {
    const contact = await this.contactRepository.findOne({ id });

    contact.isRead = true;

    await this.em.flush();

    return contact;
  }
}
