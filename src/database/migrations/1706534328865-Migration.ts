import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1706534328865 implements MigrationInterface {
  name = 'Migration1706534328865';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profile" DROP CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb"`,
    );
    await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "nickname" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."nickname" IS '닉네임(별명)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "representativeProfileId" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."representativeProfileId" IS '대표 프로필 ID'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "signUpType" character varying NOT NULL DEFAULT 'KAKAO'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."signUpType" IS '회원가입 종류(네이버/카카오)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "jobType" character varying NOT NULL DEFAULT 'ENGINEER'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."jobType" IS '직업 종류(엔지니어/디자이너)'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "numberOfLikes" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."numberOfLikes" IS '찜한 공고수'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "numberOfRegistrations" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."numberOfRegistrations" IS '등록한 공고수'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "numberOfApplications" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."numberOfApplications" IS '지원한 공고수'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "numberOfConfirmed" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."numberOfConfirmed" IS '참여확정수'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "프로필 id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD CONSTRAINT "PK_40037ca3ef7d2d24d5d54876dfd" PRIMARY KEY ("프로필 id")`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."프로필 id" IS '프로필 id'`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "content" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "eduAdmissionDate1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "eduAdmissionDate1" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."eduAdmissionDate1" IS '학력1>입학일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "eduGraduationDate1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "eduGraduationDate1" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."eduGraduationDate1" IS '학력1>졸업일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "eduAdmissionDate2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "eduAdmissionDate2" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."eduAdmissionDate2" IS '학력2>입학일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "eduGraduationDate2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "eduGraduationDate2" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."eduGraduationDate2" IS '학력2>졸업일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "eduAdmissionDate3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "eduAdmissionDate3" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."eduAdmissionDate3" IS '학력3>입학일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "eduGraduationDate3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "eduGraduationDate3" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."eduGraduationDate3" IS '학력3>졸업일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "eduAdmissionDate4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "eduAdmissionDate4" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."eduAdmissionDate4" IS '학력4>입학일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "eduGraduationDate4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "eduGraduationDate4" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."eduGraduationDate4" IS '학력4>졸업일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "eduAdmissionDate5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "eduAdmissionDate5" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."eduAdmissionDate5" IS '학력5>입학일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "eduGraduationDate5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "eduGraduationDate5" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."eduGraduationDate5" IS '학력5>졸업일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerJoinDate1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerJoinDate1" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerJoinDate1" IS '경력1>입사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerQuitDate1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerQuitDate1" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerQuitDate1" IS '경력1>퇴사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerJoinDate2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerJoinDate2" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerJoinDate2" IS '경력2>입사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerQuitDate2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerQuitDate2" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerQuitDate2" IS '경력2>퇴사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerJoinDate3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerJoinDate3" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerJoinDate3" IS '경력3>입사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerQuitDate3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerQuitDate3" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerQuitDate3" IS '경력3>퇴사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerJoinDate4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerJoinDate4" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerJoinDate4" IS '경력4>입사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerQuitDate4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerQuitDate4" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerQuitDate4" IS '경력4>퇴사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerJoinDate5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerJoinDate5" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerJoinDate5" IS '경력5>입사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerQuitDate5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerQuitDate5" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerQuitDate5" IS '경력5>퇴사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerJoinDate6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerJoinDate6" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerJoinDate6" IS '경력6>입사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerQuitDate6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerQuitDate6" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerQuitDate6" IS '경력6>퇴사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerJoinDate7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerJoinDate7" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerJoinDate7" IS '경력7>입사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerQuitDate7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerQuitDate7" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerQuitDate7" IS '경력7>퇴사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerJoinDate8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerJoinDate8" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerJoinDate8" IS '경력8>입사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerQuitDate8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerQuitDate8" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerQuitDate8" IS '경력8>퇴사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerJoinDate9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerJoinDate9" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerJoinDate9" IS '경력9>입사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerQuitDate9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerQuitDate9" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerQuitDate9" IS '경력9>퇴사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerJoinDate10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerJoinDate10" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerJoinDate10" IS '경력10>입사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerQuitDate10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerQuitDate10" character varying`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerQuitDate10" IS '경력10>퇴사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ALTER COLUMN "portfolioUrl" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ALTER COLUMN "portfolioUrl" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ALTER COLUMN "portfolioFile" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ALTER COLUMN "portfolioFile" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profile" ALTER COLUMN "portfolioFile" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ALTER COLUMN "portfolioFile" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ALTER COLUMN "portfolioUrl" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ALTER COLUMN "portfolioUrl" SET NOT NULL`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerQuitDate10" IS '경력10>퇴사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerQuitDate10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerQuitDate10" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerJoinDate10" IS '경력10>입사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerJoinDate10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerJoinDate10" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerQuitDate9" IS '경력9>퇴사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerQuitDate9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerQuitDate9" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerJoinDate9" IS '경력9>입사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerJoinDate9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerJoinDate9" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerQuitDate8" IS '경력8>퇴사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerQuitDate8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerQuitDate8" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerJoinDate8" IS '경력8>입사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerJoinDate8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerJoinDate8" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerQuitDate7" IS '경력7>퇴사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerQuitDate7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerQuitDate7" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerJoinDate7" IS '경력7>입사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerJoinDate7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerJoinDate7" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerQuitDate6" IS '경력6>퇴사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerQuitDate6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerQuitDate6" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerJoinDate6" IS '경력6>입사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerJoinDate6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerJoinDate6" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerQuitDate5" IS '경력5>퇴사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerQuitDate5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerQuitDate5" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerJoinDate5" IS '경력5>입사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerJoinDate5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerJoinDate5" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerQuitDate4" IS '경력4>퇴사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerQuitDate4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerQuitDate4" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerJoinDate4" IS '경력4>입사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerJoinDate4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerJoinDate4" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerQuitDate3" IS '경력3>퇴사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerQuitDate3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerQuitDate3" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerJoinDate3" IS '경력3>입사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerJoinDate3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerJoinDate3" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerQuitDate2" IS '경력2>퇴사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerQuitDate2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerQuitDate2" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerJoinDate2" IS '경력2>입사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerJoinDate2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerJoinDate2" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerQuitDate1" IS '경력1>퇴사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerQuitDate1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerQuitDate1" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."careerJoinDate1" IS '경력1>입사일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "careerJoinDate1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "careerJoinDate1" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."eduGraduationDate5" IS '학력5>졸업일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "eduGraduationDate5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "eduGraduationDate5" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."eduAdmissionDate5" IS '학력5>입학일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "eduAdmissionDate5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "eduAdmissionDate5" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."eduGraduationDate4" IS '학력4>졸업일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "eduGraduationDate4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "eduGraduationDate4" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."eduAdmissionDate4" IS '학력4>입학일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "eduAdmissionDate4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "eduAdmissionDate4" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."eduGraduationDate3" IS '학력3>졸업일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "eduGraduationDate3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "eduGraduationDate3" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."eduAdmissionDate3" IS '학력3>입학일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "eduAdmissionDate3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "eduAdmissionDate3" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."eduGraduationDate2" IS '학력2>졸업일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "eduGraduationDate2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "eduGraduationDate2" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."eduAdmissionDate2" IS '학력2>입학일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "eduAdmissionDate2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "eduAdmissionDate2" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."eduGraduationDate1" IS '학력1>졸업일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "eduGraduationDate1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "eduGraduationDate1" TIMESTAMP`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."eduAdmissionDate1" IS '학력1>입학일자'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "eduAdmissionDate1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "eduAdmissionDate1" TIMESTAMP`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ALTER COLUMN "content" SET DEFAULT ''`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "profile"."프로필 id" IS '프로필 id'`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP CONSTRAINT "PK_40037ca3ef7d2d24d5d54876dfd"`,
    );
    await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "프로필 id"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."numberOfConfirmed" IS '참여확정수'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "numberOfConfirmed"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."numberOfApplications" IS '지원한 공고수'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "numberOfApplications"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."numberOfRegistrations" IS '등록한 공고수'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "numberOfRegistrations"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."numberOfLikes" IS '찜한 공고수'`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "numberOfLikes"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."jobType" IS '직업 종류(엔지니어/디자이너)'`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "jobType"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."signUpType" IS '회원가입 종류(네이버/카카오)'`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "signUpType"`);
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."representativeProfileId" IS '대표 프로필 ID'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "representativeProfileId"`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."nickname" IS '닉네임(별명)'`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "nickname"`);
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "id" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id")`,
    );
  }
}
