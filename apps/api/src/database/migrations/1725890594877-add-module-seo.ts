import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddModuleSeo1725890594877 implements MigrationInterface {
  name = 'AddModuleSeo1725890594877';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" ADD "seo_meta" json`);
    await queryRunner.query(`ALTER TABLE "products" ADD "seo_meta" json`);
    await queryRunner.query(`ALTER TABLE "categories" ADD "seo_meta" json`);
    await queryRunner.query(`ALTER TABLE "contents" ADD "seo_meta" json`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contents" DROP COLUMN "seo_meta"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "seo_meta"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "seo_meta"`);
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "seo_meta"`);
  }
}
