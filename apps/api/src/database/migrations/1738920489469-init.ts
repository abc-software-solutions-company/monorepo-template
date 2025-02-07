import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1738920489469 implements MigrationInterface {
  name = 'Init1738920489469';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "categories_files" ("category_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "file_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "position" integer, CONSTRAINT "PK_4ff6b0d8bd23f5ffb4c167bbff8" PRIMARY KEY ("category_id", "file_id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "posts_files" ("post_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "file_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "position" integer, CONSTRAINT "PK_665ff32ce92376131a723a6ba67" PRIMARY KEY ("post_id", "file_id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "audit_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "record_id" character varying, "old_value" jsonb, "new_value" jsonb, "action" character varying(50) NOT NULL, "table_name" character varying(50) NOT NULL, "user_id" uuid, CONSTRAINT "PK_1bb179d048bbc581caa3b013439" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "token" character varying NOT NULL, "created_by_ip" character varying NOT NULL, "revoked_by_ip" character varying, "revoked_at" TIMESTAMP, "user_agent" character varying NOT NULL, "user_id" uuid, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE TYPE "public"."users_preferences_language_enum" AS ENUM('vi-vn', 'en-us')`);
    await queryRunner.query(`CREATE TYPE "public"."users_preferences_theme_enum" AS ENUM('dark', 'light', 'custom')`);
    await queryRunner.query(
      `CREATE TABLE "users_preferences" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "language" "public"."users_preferences_language_enum" NOT NULL DEFAULT 'en-us', "theme" "public"."users_preferences_theme_enum" NOT NULL DEFAULT 'dark', CONSTRAINT "PK_df9f09b89f65406d986a896e9ba" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "name" character varying(50), "email" character varying(320), "avatar" character varying, "phone_number" character varying, "password" character varying, "email_verified" boolean, "recovery_code" character varying, "recovered_at" TIMESTAMP, "locale" character varying, "date_of_birth" TIMESTAMP, "country" character varying, "bio" character varying(2000), "last_login" TIMESTAMP, "provider_account_id" character varying, "device_tokens" character varying array, "provider" character varying(50) NOT NULL DEFAULT 'credentials', "auth_type" character varying(50) NOT NULL DEFAULT 'credentials', "gender" character varying(50) NOT NULL DEFAULT 'male', "status" character varying(50) NOT NULL DEFAULT 'inactive', "role" character varying(50) NOT NULL DEFAULT 'user', "preference_id" uuid, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "REL_562dd99f25c312c0424128b3f7" UNIQUE ("preference_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "cover_localized" jsonb, "name_localized" jsonb, "description_localized" jsonb, "body_localized" jsonb, "seo_meta" jsonb, "slug" character varying(255) NOT NULL, "type" character varying(50), "status" character varying(50) NOT NULL DEFAULT 'draft', "creator_id" uuid, "category_id" uuid, CONSTRAINT "UQ_464f927ae360106b783ed0b4106" UNIQUE ("slug"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "products_files" ("product_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "file_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "position" integer, CONSTRAINT "PK_0af1db78d5c9d67dec0cd9d9ccc" PRIMARY KEY ("product_id", "file_id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "files" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "name" character varying(255) NOT NULL, "unique_name" character varying(255) NOT NULL, "caption" character varying(255), "ext" character varying(5) NOT NULL, "size" bigint NOT NULL, "mime" character varying(50) NOT NULL, "is_temp" boolean NOT NULL DEFAULT true, "status" character varying(50) NOT NULL DEFAULT 'published', "category_id" uuid, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "cover_localized" jsonb, "name_localized" jsonb, "description_localized" jsonb, "body_localized" jsonb, "seo_meta" jsonb, "slug" character varying(255) NOT NULL, "type" character varying(50) NOT NULL DEFAULT 'news', "status" character varying(50) NOT NULL DEFAULT 'published', "creator_id" uuid, "parent_id" uuid, CONSTRAINT "UQ_420d9f679d41281f282f5bc7d09" UNIQUE ("slug"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "cover_localized" jsonb, "name_localized" jsonb, "description_localized" jsonb, "body_localized" jsonb, "seo_meta" jsonb, "slug" character varying(255) NOT NULL, "type" character varying(50), "status" character varying(50) NOT NULL DEFAULT 'draft', "creator_id" uuid, "category_id" uuid, CONSTRAINT "UQ_54ddf9075260407dcfdd7248577" UNIQUE ("slug"), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "name" character varying(255) NOT NULL, "email" character varying(320) NOT NULL, "subject" character varying(255), "message" character varying(5000) NOT NULL, "is_read" boolean NOT NULL DEFAULT false, "status" character varying(50) NOT NULL DEFAULT 'published', CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "title" character varying(255) NOT NULL, "content" character varying(255) NOT NULL, "image" character varying, "topic" character varying, "scheduling" character varying, "channel_id" character varying, "sound" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "faqs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP DEFAULT now(), "title_localized" jsonb, "description_localized" jsonb, "status" character varying(50) NOT NULL DEFAULT 'draft', CONSTRAINT "PK_2ddf4f2c910f8e8fa2663a67bf0" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "categories_files" ADD CONSTRAINT "FK_1b27b445cd834ecb395b8d647ee" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "categories_files" ADD CONSTRAINT "FK_d5d4bd4298327c8c409b7af80ff" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "posts_files" ADD CONSTRAINT "FK_21a3420139c27ee562d4a04aed3" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "posts_files" ADD CONSTRAINT "FK_847ed3dd8076e19eec9885c375e" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "audit_logs" ADD CONSTRAINT "FK_bd2726fd31b35443f2245b93ba0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "FK_562dd99f25c312c0424128b3f72" FOREIGN KEY ("preference_id") REFERENCES "users_preferences"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_db887c3b31abbbd920e303a0179" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "products_files" ADD CONSTRAINT "FK_1a3fa5ac08c408fb7888d6f6231" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "products_files" ADD CONSTRAINT "FK_a547c9f154932f00874a5b211ca" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "files" ADD CONSTRAINT "FK_6ca4ba01b61dc707723663a7b25" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "FK_75fbfb148e4683b47bb64bbeed9" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "categories" ADD CONSTRAINT "FK_88cea2dc9c31951d06437879b40" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_c810f0ccb5f80b289391454d4ad" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_852f266adc5d67c40405c887b49" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_852f266adc5d67c40405c887b49"`);
    await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c810f0ccb5f80b289391454d4ad"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_88cea2dc9c31951d06437879b40"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_75fbfb148e4683b47bb64bbeed9"`);
    await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_6ca4ba01b61dc707723663a7b25"`);
    await queryRunner.query(`ALTER TABLE "products_files" DROP CONSTRAINT "FK_a547c9f154932f00874a5b211ca"`);
    await queryRunner.query(`ALTER TABLE "products_files" DROP CONSTRAINT "FK_1a3fa5ac08c408fb7888d6f6231"`);
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`);
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_db887c3b31abbbd920e303a0179"`);
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_562dd99f25c312c0424128b3f72"`);
    await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
    await queryRunner.query(`ALTER TABLE "audit_logs" DROP CONSTRAINT "FK_bd2726fd31b35443f2245b93ba0"`);
    await queryRunner.query(`ALTER TABLE "posts_files" DROP CONSTRAINT "FK_847ed3dd8076e19eec9885c375e"`);
    await queryRunner.query(`ALTER TABLE "posts_files" DROP CONSTRAINT "FK_21a3420139c27ee562d4a04aed3"`);
    await queryRunner.query(`ALTER TABLE "categories_files" DROP CONSTRAINT "FK_d5d4bd4298327c8c409b7af80ff"`);
    await queryRunner.query(`ALTER TABLE "categories_files" DROP CONSTRAINT "FK_1b27b445cd834ecb395b8d647ee"`);
    await queryRunner.query(`DROP TABLE "faqs"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "contacts"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "files"`);
    await queryRunner.query(`DROP TABLE "products_files"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "users_preferences"`);
    await queryRunner.query(`DROP TYPE "public"."users_preferences_theme_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_preferences_language_enum"`);
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(`DROP TABLE "posts_files"`);
    await queryRunner.query(`DROP TABLE "categories_files"`);
  }
}
