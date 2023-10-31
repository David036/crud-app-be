import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedIsAdminField1698389987384 implements MigrationInterface {
    name = 'AddedIsAdminField1698389987384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_auth" ADD "isAdmin" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_auth" ADD "phoneNumber" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_auth" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "user_auth" DROP COLUMN "isAdmin"`);
    }

}
