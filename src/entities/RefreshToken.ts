import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { UserAuth } from "./UserAuth";

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @Column()
  token!: string;

  @OneToOne(() => UserAuth)
  @JoinColumn({ name: "user_id" })
  user!: UserAuth;
}
