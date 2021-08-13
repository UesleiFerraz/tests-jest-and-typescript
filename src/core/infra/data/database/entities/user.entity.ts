import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import { ScrapEntity } from "./scrap.entity";

@Entity({ name: "users" })
export class UserEntity extends BaseEntity {
  @PrimaryColumn()
  uid: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @OneToMany(() => ScrapEntity, scrap => scrap.user)
  scraps: ScrapEntity[];

  @BeforeInsert()
  private beforeInsert = async () => {
    this.uid = uuid();
    this.password = await bcrypt.hash(this.password, 10);
    this.createdAt = new Date(formatDateToBrasilTime());
    this.updatedAt = new Date(formatDateToBrasilTime());
  };

  @BeforeUpdate()
  private beforeUpdate = async () => {
    this.password = await bcrypt.hash(this.password, 10);
    this.updatedAt = new Date(formatDateToBrasilTime());
  };
}

function formatDateToBrasilTime() {
  return new Date().setHours(new Date().getHours() - 3);
}
