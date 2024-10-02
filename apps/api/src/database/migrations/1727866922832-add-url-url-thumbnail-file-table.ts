import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUrlUrlThumbnailFileTable1727866922832 implements MigrationInterface {
  name = 'AddUrlUrlThumbnailFileTable1727866922832';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "files" ADD "url" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "files" ADD "thumbnail_url" character varying(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "thumbnail_url"`);
    await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "url"`);
  }
}
