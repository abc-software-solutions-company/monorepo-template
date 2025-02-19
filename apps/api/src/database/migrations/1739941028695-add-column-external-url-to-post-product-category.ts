import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnExternalUrlToPostProductCategory1739941028695 implements MigrationInterface {
  name = 'AddColumnExternalUrlToPostProductCategory1739941028695';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" ADD "external_url" character varying(2048)`);
    await queryRunner.query(`ALTER TABLE "categories" ADD "external_url" character varying(2048)`);
    await queryRunner.query(`ALTER TABLE "products" ADD "external_url" character varying(2048)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "external_url"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "external_url"`);
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "external_url"`);
  }
}
