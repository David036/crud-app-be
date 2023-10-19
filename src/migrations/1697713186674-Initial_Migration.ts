import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1697713186674 implements MigrationInterface {
    name = 'InitialMigration1697713186674'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "surname" character varying NOT NULL, "age" integer NOT NULL, "createdById" character varying NOT NULL, "createdDate" TIMESTAMP, "lastModifiedDate" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_auth" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_56d00ec31dc3eed1c3f6bff4f58" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user_auth"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
