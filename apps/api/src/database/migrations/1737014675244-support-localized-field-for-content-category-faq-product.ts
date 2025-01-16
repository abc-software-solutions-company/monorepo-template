import { MigrationInterface, QueryRunner } from "typeorm";

export class SupportLocalizedFieldForContentCategoryFaqProduct1737014675244 implements MigrationInterface {
    name = 'SupportLocalizedFieldForContentCategoryFaqProduct1737014675244'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "name_localized" jsonb`);
        await queryRunner.query(`ALTER TABLE "products" ADD "description_localized" jsonb`);
        await queryRunner.query(`ALTER TABLE "products" ADD "body_localized" jsonb`);
        await queryRunner.query(`ALTER TABLE "products" ADD "cover_localized" jsonb`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "name_localized" jsonb`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "description_localized" jsonb`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "body_localized" jsonb`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "cover_localized" jsonb`);
        await queryRunner.query(`ALTER TABLE "contents" ADD "name_localized" jsonb`);
        await queryRunner.query(`ALTER TABLE "contents" ADD "description_localized" jsonb`);
        await queryRunner.query(`ALTER TABLE "contents" ADD "body_localized" jsonb`);
        await queryRunner.query(`ALTER TABLE "faqs" ADD "title_localized" jsonb`);
        await queryRunner.query(`ALTER TABLE "faqs" ADD "content_localized" jsonb`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contents" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "faqs" ALTER COLUMN "title" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "faqs" ALTER COLUMN "content" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "faqs" ALTER COLUMN "content" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "faqs" ALTER COLUMN "title" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contents" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "name" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "faqs" DROP COLUMN "content_localized"`);
        await queryRunner.query(`ALTER TABLE "faqs" DROP COLUMN "title_localized"`);
        await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "body_localized"`);
        await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "description_localized"`);
        await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "name_localized"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "cover_localized"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "body_localized"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "description_localized"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "name_localized"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "cover_localized"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "body_localized"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "description_localized"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "name_localized"`);
    }

}
