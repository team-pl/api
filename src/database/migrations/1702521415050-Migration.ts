import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1702521415050 implements MigrationInterface {
    name = 'Migration1702521415050'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "kakaoId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "kakaoId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "refreshToken" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "refreshToken" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "refreshToken" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "refreshToken" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "kakaoId" SET DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "kakaoId" SET NOT NULL`);
    }

}
