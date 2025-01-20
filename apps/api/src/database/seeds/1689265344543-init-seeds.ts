import { glob } from 'glob';
import path from 'path';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { Category } from '@/modules/categories/entities/category.entity';
import { Contact } from '@/modules/contacts/entities/contact.entity';
import { Faq } from '@/modules/faqs/entities/faq.entity';
import { FILE_ROOT_PATH, THUMBNAIL_PATH } from '@/modules/files/constants/files.constant';
import { File } from '@/modules/files/entities/file.entity';
import { copyFile, createDirectory, createThumbnail, removeDirectory } from '@/modules/files/utils/file.util';
import { Post } from '@/modules/posts/entities/post.entity';
import { Product } from '@/modules/products/entities/product.entity';
import { User } from '@/modules/users/entities/user.entity';

import { categoryFactory } from '../factories/dev/category.factory';
import { contactFactory } from '../factories/dev/contact.factory';
import { faqFactory } from '../factories/dev/faq.factory';
import { fileFactory } from '../factories/dev/file.factory';
import { postFactory } from '../factories/dev/post.factory';
import { productFactory } from '../factories/dev/product.factory';
import { userFactory } from '../factories/user.factory';

export class InitSeeds1689265344543 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.getRepository(User).save(userFactory);
    await queryRunner.manager.getRepository(Category).save(categoryFactory);
    await queryRunner.manager.getRepository(File).save(fileFactory);
    await queryRunner.manager.getRepository(Post).save(postFactory);
    await queryRunner.manager.getRepository(Product).save(productFactory);
    await queryRunner.manager.getRepository(Faq).save(faqFactory);
    await queryRunner.manager.getRepository(Contact).save(contactFactory);

    generateAssets();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await Promise.all(contactFactory.map(async (x: Contact) => await queryRunner.manager.getRepository(Contact).remove(x)));
    await Promise.all(faqFactory.map(async (x: Faq) => await queryRunner.manager.getRepository(Faq).remove(x)));
    await Promise.all(productFactory.map(async (x: Product) => await queryRunner.manager.getRepository(Product).remove(x)));
    await Promise.all(postFactory.map(async (x: Post) => await queryRunner.manager.getRepository(Post).remove(x)));
    await Promise.all(fileFactory.map(async (x: File) => await queryRunner.manager.getRepository(File).remove(x)));
    await Promise.all(categoryFactory.map(async (x: Category) => await queryRunner.manager.getRepository(Category).remove(x)));
    await Promise.all(userFactory.map(async (x: User) => await queryRunner.manager.getRepository(User).remove(x)));
  }
}

function generateAssets() {
  const files = glob.sync(path.join(__dirname, '../factories/assets/*.*'));

  removeDirectory(FILE_ROOT_PATH);
  createDirectory(FILE_ROOT_PATH);
  createDirectory(THUMBNAIL_PATH);

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filename = path.basename(file);

    copyFile(file, path.join(FILE_ROOT_PATH, filename));
    createThumbnail(file, filename);
  }
}
