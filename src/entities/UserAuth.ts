import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class UserAuth {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  isAdmin!: boolean;

  @Column()
  phoneNumber!: string;
}
