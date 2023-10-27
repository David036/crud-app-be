import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";
import { AvailabilityStatus } from '../enums';
import { Image } from './Image';

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  category!: string;

  @Column('simple-array')
  sizes!: string[]; 

  @Column()
  price!: string;

  @Column('enum', { enum: AvailabilityStatus })
  availability_status!: AvailabilityStatus;

  @ManyToMany(() => Image, { cascade: true })
  @JoinTable()
  images!: Image[];

  @Column()
  color!: string;

  @Column()
  createdById!: string;

  @Column({ nullable: true })
  createdDate?: Date;

  @Column({ nullable: true })
  lastModifiedDate?: Date;
}
