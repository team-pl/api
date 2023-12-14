import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1702533336685 implements MigrationInterface {
    name = 'Migration1702533336685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "profile" character varying`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."profile" IS '프로필사진 url'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "user"."profile" IS '프로필사진 url'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "profile"`);
    }

}
