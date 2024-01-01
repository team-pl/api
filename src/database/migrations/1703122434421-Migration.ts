import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1703122434421 implements MigrationInterface {
    name = 'Migration1703122434421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "naverId" character varying`);
        await queryRunner.query(`COMMENT ON COLUMN "user"."naverId" IS '네이버 ID(네이버에서 제공해주며, 네이버 소셜 로그인으로 가입한 사용자는 고유 ID를 가짐)'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "user"."naverId" IS '네이버 ID(네이버에서 제공해주며, 네이버 소셜 로그인으로 가입한 사용자는 고유 ID를 가짐)'`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "naverId"`);
    }

}
