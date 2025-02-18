import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnPublishDateToPostProductCategory1739870726511 implements MigrationInterface {
  name = 'AddColumnPublishDateToPostProductCategory1739870726511';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" ADD "publish_date" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "products" ADD "publish_date" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "categories" ADD "publish_date" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "publish_date"`);
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "publish_date"`);
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "publish_date"`);
  }
}
