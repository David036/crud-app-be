import { MigrationInterface, QueryRunner } from "typeorm";

export class AuthColumnNameChange1696418811943 implements MigrationInterface {
    name = 'AuthColumnNameChange1696418811943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_auth" RENAME COLUMN "username" TO "email"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_auth" RENAME COLUMN "email" TO "username"`);
    }

}
