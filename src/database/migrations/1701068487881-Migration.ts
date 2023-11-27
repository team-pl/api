import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1701068487881 implements MigrationInterface {
    name = 'Migration1701068487881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`);
    }

}
