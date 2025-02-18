import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnOrderToPost1739775860708 implements MigrationInterface {
  name = 'AddColumnOrderToPost1739775860708';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" ADD "order" integer NOT NULL DEFAULT '0'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "order"`);
  }
}
