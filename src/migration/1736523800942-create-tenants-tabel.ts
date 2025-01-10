import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTenantsTabel1736523800942 implements MigrationInterface {
   name = 'CreateTenantsTabel1736523800942'

   public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(
         `CREATE TABLE "tenants" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "address" character varying(255) NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "CreatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`,
      )
   }

   public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`DROP TABLE "tenants"`)
   }
}
