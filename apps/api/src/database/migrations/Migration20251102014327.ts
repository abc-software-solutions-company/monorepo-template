import { Migration } from '@mikro-orm/migrations';

export class Migration20251102014327 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "contacts" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz null, "name" varchar(255) not null, "email" varchar(320) not null, "subject" varchar(255) null, "message" varchar(5000) not null, "is_read" boolean not null default false, "status" text check ("status" in ('published', 'readed', 'deleted')) not null default 'published', constraint "contacts_pkey" primary key ("id"));`);

    this.addSql(`create table "faqs" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz null, "title_localized" jsonb null, "description_localized" jsonb null, "status" text check ("status" in ('published', 'draft', 'deleted')) not null default 'draft', constraint "faqs_pkey" primary key ("id"));`);

    this.addSql(`create table "notifications" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz null, "title" varchar(255) not null, "content" varchar(255) not null, "image" varchar(255) null, "topic" varchar(255) null, "scheduling" varchar(255) null, "channel_id" varchar(255) null, "sound" boolean not null default false, constraint "notifications_pkey" primary key ("id"));`);

    this.addSql(`create table "users_preferences" ("id" uuid not null default gen_random_uuid(), "language" text check ("language" in ('vi-vn', 'en-us')) not null default 'en-us', "theme" text check ("theme" in ('dark', 'light', 'custom')) not null default 'dark', constraint "users_preferences_pkey" primary key ("id"));`);

    this.addSql(`create table "users" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz null, "name" varchar(50) null, "email" varchar(320) null, "avatar" varchar(255) null, "phone_number" varchar(255) null, "password" varchar(255) null, "email_verified" boolean null, "recovery_code" varchar(255) null, "recovered_at" timestamptz null, "locale" varchar(255) null, "date_of_birth" timestamptz null, "country" varchar(255) null, "bio" varchar(2000) null, "last_login" timestamptz null, "provider_account_id" varchar(255) null, "device_tokens" text[] null, "provider" text check ("provider" in ('credentials', 'facebook', 'google', 'apple')) not null default 'credentials', "auth_type" text check ("auth_type" in ('credentials', 'oauth')) not null default 'credentials', "gender" text check ("gender" in ('male', 'female', 'other')) not null default 'male', "status" text check ("status" in ('active', 'inactive', 'deleted', 'blocked', 'not_verified')) not null default 'inactive', "role" text check ("role" in ('super_admin', 'admin', 'user')) not null default 'user', "preference_id" uuid null, constraint "users_pkey" primary key ("id"));`);
    this.addSql(`alter table "users" add constraint "users_email_unique" unique ("email");`);
    this.addSql(`alter table "users" add constraint "users_preference_id_unique" unique ("preference_id");`);

    this.addSql(`create table "refresh_tokens" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz null, "token" varchar(255) not null, "created_by_ip" varchar(255) not null, "revoked_by_ip" varchar(255) null, "revoked_at" timestamptz null, "user_agent" varchar(255) not null, "user_id" uuid not null, constraint "refresh_tokens_pkey" primary key ("id"));`);

    this.addSql(`create table "categories" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz null, "cover_localized" jsonb null, "name_localized" jsonb null, "description_localized" jsonb null, "body_localized" jsonb null, "seo_meta" jsonb null, "slug" varchar(255) not null, "type" text check ("type" in ('news', 'page', 'product')) not null default 'news', "external_url" varchar(2048) null, "status" text check ("status" in ('published', 'draft', 'deleted')) not null default 'published', "publish_date" timestamptz null, "creator_id" uuid null, "parent_id" uuid null, constraint "categories_pkey" primary key ("id"));`);
    this.addSql(`alter table "categories" add constraint "categories_slug_unique" unique ("slug");`);

    this.addSql(`create table "products" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz null, "cover_localized" jsonb null, "name_localized" jsonb null, "description_localized" jsonb null, "body_localized" jsonb null, "seo_meta" jsonb null, "slug" varchar(255) not null, "type" varchar(50) null, "external_url" varchar(2048) null, "status" text check ("status" in ('published', 'draft', 'deleted')) not null default 'draft', "publish_date" timestamptz null, "creator_id" uuid null, "category_id" uuid null, constraint "products_pkey" primary key ("id"));`);
    this.addSql(`alter table "products" add constraint "products_slug_unique" unique ("slug");`);

    this.addSql(`create table "posts" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz null, "cover_localized" jsonb null, "name_localized" jsonb null, "description_localized" jsonb null, "body_localized" jsonb null, "seo_meta" jsonb null, "slug" varchar(255) not null, "type" varchar(50) null, "external_url" varchar(2048) null, "status" text check ("status" in ('published', 'draft', 'deleted')) not null default 'draft', "order" int not null default 0, "publish_date" timestamptz null, "creator_id" uuid null, "category_id" uuid null, constraint "posts_pkey" primary key ("id"));`);
    this.addSql(`alter table "posts" add constraint "posts_slug_unique" unique ("slug");`);

    this.addSql(`create table "files" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz null, "name" varchar(255) not null, "unique_name" varchar(255) not null, "caption" varchar(255) null, "ext" varchar(5) not null, "size" bigint not null, "mime" varchar(50) not null, "is_temp" boolean not null default true, "status" text check ("status" in ('published', 'draft', 'deleted')) not null default 'published', "category_id" uuid null, constraint "files_pkey" primary key ("id"));`);

    this.addSql(`create table "products_files" ("product_id" uuid not null, "file_id" uuid not null, "position" int null, constraint "products_files_pkey" primary key ("product_id", "file_id"));`);

    this.addSql(`create table "posts_files" ("post_id" uuid not null, "file_id" uuid not null, "position" int null, constraint "posts_files_pkey" primary key ("post_id", "file_id"));`);

    this.addSql(`create table "categories_files" ("category_id" uuid not null, "file_id" uuid not null, "position" int null, constraint "categories_files_pkey" primary key ("category_id", "file_id"));`);

    this.addSql(`create table "audit_logs" ("id" uuid not null default gen_random_uuid(), "created_at" timestamptz not null default CURRENT_TIMESTAMP, "updated_at" timestamptz null, "record_id" varchar(255) null, "old_value" jsonb null, "new_value" jsonb null, "user_id" uuid null, "action" text check ("action" in ('create', 'update', 'delete')) not null, "table_name" text check ("table_name" in ('users', 'files', 'posts', 'products', 'categories')) not null, constraint "audit_logs_pkey" primary key ("id"));`);

    this.addSql(`alter table "users" add constraint "users_preference_id_foreign" foreign key ("preference_id") references "users_preferences" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "refresh_tokens" add constraint "refresh_tokens_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade;`);

    this.addSql(`alter table "categories" add constraint "categories_creator_id_foreign" foreign key ("creator_id") references "users" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "categories" add constraint "categories_parent_id_foreign" foreign key ("parent_id") references "categories" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "products" add constraint "products_creator_id_foreign" foreign key ("creator_id") references "users" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "products" add constraint "products_category_id_foreign" foreign key ("category_id") references "categories" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "posts" add constraint "posts_creator_id_foreign" foreign key ("creator_id") references "users" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "posts" add constraint "posts_category_id_foreign" foreign key ("category_id") references "categories" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "files" add constraint "files_category_id_foreign" foreign key ("category_id") references "categories" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "products_files" add constraint "products_files_product_id_foreign" foreign key ("product_id") references "products" ("id") on update cascade;`);
    this.addSql(`alter table "products_files" add constraint "products_files_file_id_foreign" foreign key ("file_id") references "files" ("id") on update cascade;`);

    this.addSql(`alter table "posts_files" add constraint "posts_files_post_id_foreign" foreign key ("post_id") references "posts" ("id") on update cascade;`);
    this.addSql(`alter table "posts_files" add constraint "posts_files_file_id_foreign" foreign key ("file_id") references "files" ("id") on update cascade;`);

    this.addSql(`alter table "categories_files" add constraint "categories_files_category_id_foreign" foreign key ("category_id") references "categories" ("id") on update cascade;`);
    this.addSql(`alter table "categories_files" add constraint "categories_files_file_id_foreign" foreign key ("file_id") references "files" ("id") on update cascade;`);

    this.addSql(`alter table "audit_logs" add constraint "audit_logs_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" drop constraint "users_preference_id_foreign";`);

    this.addSql(`alter table "refresh_tokens" drop constraint "refresh_tokens_user_id_foreign";`);

    this.addSql(`alter table "categories" drop constraint "categories_creator_id_foreign";`);

    this.addSql(`alter table "products" drop constraint "products_creator_id_foreign";`);

    this.addSql(`alter table "posts" drop constraint "posts_creator_id_foreign";`);

    this.addSql(`alter table "audit_logs" drop constraint "audit_logs_user_id_foreign";`);

    this.addSql(`alter table "categories" drop constraint "categories_parent_id_foreign";`);

    this.addSql(`alter table "products" drop constraint "products_category_id_foreign";`);

    this.addSql(`alter table "posts" drop constraint "posts_category_id_foreign";`);

    this.addSql(`alter table "files" drop constraint "files_category_id_foreign";`);

    this.addSql(`alter table "categories_files" drop constraint "categories_files_category_id_foreign";`);

    this.addSql(`alter table "products_files" drop constraint "products_files_product_id_foreign";`);

    this.addSql(`alter table "posts_files" drop constraint "posts_files_post_id_foreign";`);

    this.addSql(`alter table "products_files" drop constraint "products_files_file_id_foreign";`);

    this.addSql(`alter table "posts_files" drop constraint "posts_files_file_id_foreign";`);

    this.addSql(`alter table "categories_files" drop constraint "categories_files_file_id_foreign";`);

    this.addSql(`drop table if exists "contacts" cascade;`);

    this.addSql(`drop table if exists "faqs" cascade;`);

    this.addSql(`drop table if exists "notifications" cascade;`);

    this.addSql(`drop table if exists "users_preferences" cascade;`);

    this.addSql(`drop table if exists "users" cascade;`);

    this.addSql(`drop table if exists "refresh_tokens" cascade;`);

    this.addSql(`drop table if exists "categories" cascade;`);

    this.addSql(`drop table if exists "products" cascade;`);

    this.addSql(`drop table if exists "posts" cascade;`);

    this.addSql(`drop table if exists "files" cascade;`);

    this.addSql(`drop table if exists "products_files" cascade;`);

    this.addSql(`drop table if exists "posts_files" cascade;`);

    this.addSql(`drop table if exists "categories_files" cascade;`);

    this.addSql(`drop table if exists "audit_logs" cascade;`);
  }

}
