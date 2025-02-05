import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnSubjectToContact1737515951131 implements MigrationInterface {
  name = 'AddColumnSubjectToContact1737515951131';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contacts" ADD "subject" character varying(255)`);
    await queryRunner.query(`ALTER TABLE "contacts" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "contacts" ADD "email" character varying(320) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "contacts" DROP COLUMN "message"`);
    await queryRunner.query(`ALTER TABLE "contacts" ADD "message" character varying(5000) NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "contacts" DROP COLUMN "message"`);
    await queryRunner.query(`ALTER TABLE "contacts" ADD "message" character varying(1000) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "contacts" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "contacts" ADD "email" character varying(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "contacts" DROP COLUMN "subject"`);
  }
}
