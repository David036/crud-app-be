import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1698850183002 implements MigrationInterface {
    name = 'InitialMigration1698850183002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "size_availability" ("id" SERIAL NOT NULL, "size" "public"."size_availability_size_enum" NOT NULL, "availability_status" "public"."size_availability_availability_status_enum", "productId" uuid NOT NULL, CONSTRAINT "PK_52a11dcee0ef206a14c55d5a5f1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "category" "public"."product_category_enum" NOT NULL, "collections" "public"."product_collections_enum" array NOT NULL, "price" numeric(10,2) NOT NULL, "availability_status" "public"."product_availability_status_enum", "color" character varying NOT NULL, "createdById" character varying NOT NULL, "createdDate" TIMESTAMP, "lastModifiedDate" TIMESTAMP, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "surname" character varying NOT NULL, "age" integer NOT NULL, "createdById" character varying NOT NULL, "createdDate" TIMESTAMP, "lastModifiedDate" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, "isAdmin" boolean NOT NULL, "phoneNumber" character varying NOT NULL, CONSTRAINT "PK_56d00ec31dc3eed1c3f6bff4f58" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "token" character varying NOT NULL, "user_id" uuid, CONSTRAINT "REL_6bbe63d2fe75e7f0ba1710351d" UNIQUE ("user_id"), CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_images_image" ("productId" uuid NOT NULL, "imageId" uuid NOT NULL, CONSTRAINT "PK_d326f439909c5e540caf4d640af" PRIMARY KEY ("productId", "imageId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_59e342befd2e3c2933b2f89b7d" ON "product_images_image" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_72057fd26667428255bcb600d0" ON "product_images_image" ("imageId") `);
        await queryRunner.query(`ALTER TABLE "size_availability" ADD CONSTRAINT "FK_55ad717ce71e80521ea86e67655" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4" FOREIGN KEY ("user_id") REFERENCES "user_auth"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_images_image" ADD CONSTRAINT "FK_59e342befd2e3c2933b2f89b7d0" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_images_image" ADD CONSTRAINT "FK_72057fd26667428255bcb600d07" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_images_image" DROP CONSTRAINT "FK_72057fd26667428255bcb600d07"`);
        await queryRunner.query(`ALTER TABLE "product_images_image" DROP CONSTRAINT "FK_59e342befd2e3c2933b2f89b7d0"`);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_6bbe63d2fe75e7f0ba1710351d4"`);
        await queryRunner.query(`ALTER TABLE "size_availability" DROP CONSTRAINT "FK_55ad717ce71e80521ea86e67655"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_72057fd26667428255bcb600d0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_59e342befd2e3c2933b2f89b7d"`);
        await queryRunner.query(`DROP TABLE "product_images_image"`);
        await queryRunner.query(`DROP TABLE "refresh_token"`);
        await queryRunner.query(`DROP TABLE "user_auth"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "size_availability"`);
        await queryRunner.query(`DROP TABLE "image"`);
    }

}
