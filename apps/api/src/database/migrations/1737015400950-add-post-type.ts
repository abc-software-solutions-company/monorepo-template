import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPostType1737015400950 implements MigrationInterface {
  name = 'AddPostType1737015400950';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" ADD "type" character varying(50)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "type"`);
  }
}
