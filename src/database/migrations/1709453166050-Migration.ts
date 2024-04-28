import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1709453166050 implements MigrationInterface {
  name = 'Migration1709453166050';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "isTemporaryStorage"`,
    );
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "jobType"`);
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "content" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "content" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "jobType" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment" ADD "name" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "isTemporaryStorage" boolean NOT NULL DEFAULT false`,
    );
  }
}
