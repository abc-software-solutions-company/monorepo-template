import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMultiLanguageForRemainModules1737121635977 implements MigrationInterface {
  name = 'AddMultiLanguageForRemainModules1737121635977';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "cover"`);
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "body"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "body"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "cover"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "body"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "cover"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "description"`);
    await queryRunner.query(`ALTER TABLE "faqs" DROP COLUMN "title"`);
    await queryRunner.query(`ALTER TABLE "faqs" DROP COLUMN "content"`);
    await queryRunner.query(`ALTER TABLE "products" ADD "cover_localized" jsonb`);
    await queryRunner.query(`ALTER TABLE "products" ADD "name_localized" jsonb`);
    await queryRunner.query(`ALTER TABLE "products" ADD "description_localized" jsonb`);
    await queryRunner.query(`ALTER TABLE "products" ADD "body_localized" jsonb`);
    await queryRunner.query(`ALTER TABLE "products" ADD "type" character varying(50)`);
    await queryRunner.query(`ALTER TABLE "categories" ADD "cover_localized" jsonb`);
    await queryRunner.query(`ALTER TABLE "categories" ADD "name_localized" jsonb`);
    await queryRunner.query(`ALTER TABLE "categories" ADD "description_localized" jsonb`);
    await queryRunner.query(`ALTER TABLE "categories" ADD "body_localized" jsonb`);
    await queryRunner.query(`ALTER TABLE "faqs" ADD "title_localized" jsonb`);
    await queryRunner.query(`ALTER TABLE "faqs" ADD "description_localized" jsonb`);
    await queryRunner.query(`ALTER TYPE "public"."categories_type_enum" RENAME TO "categories_type_enum_old"`);
    await queryRunner.query(`CREATE TYPE "public"."categories_type_enum" AS ENUM('default', 'file', 'product', 'post')`);
    await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "type" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "categories" ALTER COLUMN "type" TYPE "public"."categories_type_enum" USING "type"::"text"::"public"."categories_type_enum"`
    );
    await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "type" SET DEFAULT 'post'`);
    await queryRunner.query(`DROP TYPE "public"."categories_type_enum_old"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."categories_type_enum_old" AS ENUM('file', 'product', 'post')`);
    await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "type" DROP DEFAULT`);
    await queryRunner.query(
      `ALTER TABLE "categories" ALTER COLUMN "type" TYPE "public"."categories_type_enum_old" USING "type"::"text"::"public"."categories_type_enum_old"`
    );
    await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "type" SET DEFAULT 'post'`);
    await queryRunner.query(`DROP TYPE "public"."categories_type_enum"`);
    await queryRunner.query(`ALTER TYPE "public"."categories_type_enum_old" RENAME TO "categories_type_enum"`);
    await queryRunner.query(`ALTER TABLE "faqs" DROP COLUMN "description_localized"`);
    await queryRunner.query(`ALTER TABLE "faqs" DROP COLUMN "title_localized"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "body_localized"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "description_localized"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "name_localized"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "cover_localized"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "type"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "body_localized"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "description_localized"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "name_localized"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "cover_localized"`);
    await queryRunner.query(`ALTER TABLE "faqs" ADD "content" character varying(2000) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "faqs" ADD "title" character varying(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "categories" ADD "description" character varying(2000)`);
    await queryRunner.query(`ALTER TABLE "categories" ADD "name" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "categories" ADD "cover" character varying(1000)`);
    await queryRunner.query(`ALTER TABLE "categories" ADD "body" text`);
    await queryRunner.query(`ALTER TABLE "products" ADD "description" character varying(2000)`);
    await queryRunner.query(`ALTER TABLE "products" ADD "name" character varying(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "products" ADD "cover" character varying(1000)`);
    await queryRunner.query(`ALTER TABLE "products" ADD "body" text`);
    await queryRunner.query(`ALTER TABLE "posts" ADD "body" text`);
    await queryRunner.query(`ALTER TABLE "posts" ADD "description" character varying(2000)`);
    await queryRunner.query(`ALTER TABLE "posts" ADD "name" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "posts" ADD "cover" character varying(1000)`);
  }
}
