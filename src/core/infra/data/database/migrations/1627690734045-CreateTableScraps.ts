import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateTableScraps1627690734045 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "scraps",
        columns: [
          {
            name: "uid",
            type: "uuid",
            isPrimary: true,
            isNullable: false,
            isUnique: true,
          },
          {
            name: "title",
            type: "varchar",
            length: "50",
            isNullable: false,
          },
          {
            name: "description",
            type: "text",
            isNullable: false,
          },
          {
            name: "user_uid",
            type: "uuid",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            isNullable: false,
            default: "NOW()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            isNullable: false,
            default: "NOW()",
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            name: "fk_scraps_users",
            columnNames: ["user_uid"],
            referencedColumnNames: ["uid"],
            referencedTableName: "users",
          }),
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("scraps", true, true, true);
  }
}
