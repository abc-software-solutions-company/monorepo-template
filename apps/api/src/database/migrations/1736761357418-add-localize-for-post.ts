import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLocalizeForPost1736761357418 implements MigrationInterface {
  name = 'AddLocalizeForPost1736761357418';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" ADD "name_localized" jsonb`);
    await queryRunner.query(`ALTER TABLE "posts" ADD "description_localized" jsonb`);
    await queryRunner.query(`ALTER TABLE "posts" ADD "body_localized" jsonb`);
    await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "name" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "name" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "body_localized"`);
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "description_localized"`);
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "name_localized"`);
  }
}
