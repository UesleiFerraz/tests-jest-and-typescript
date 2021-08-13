import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { v4 as uuid } from "uuid";
import { UserEntity } from "./user.entity";

@Entity({ name: "scraps" })
export class ScrapEntity extends BaseEntity {
  @PrimaryColumn()
  uid: string;

  @Column({ length: "50" })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ name: "user_uid" })
  userUid: string;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, user => user.scraps)
  @JoinColumn({ name: "user_uid", referencedColumnName: "uid" })
  user: UserEntity;

  @BeforeInsert()
  private beforeInsert = () => {
    this.uid = uuid();
    this.createdAt = new Date(formatDateToBrasilTime());
    this.updatedAt = new Date(formatDateToBrasilTime());
  };

  @BeforeUpdate()
  private beforeUpdate = () => {
    this.updatedAt = new Date(formatDateToBrasilTime());
  };
}

function formatDateToBrasilTime() {
  return new Date().setHours(new Date().getHours() - 3);
}
