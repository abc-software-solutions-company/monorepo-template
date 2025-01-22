import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBucketPathColumnFiles1737532416801 implements MigrationInterface {
  name = 'AddBucketPathColumnFiles1737532416801';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "files" ADD "bucket_path" character varying(255)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "bucket_path"`);
  }
}
