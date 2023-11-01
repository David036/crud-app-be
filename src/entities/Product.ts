import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { AvailabilityStatus, ProductCategory, Collection } from '../enums';
import { Image } from './Image';
import { SizeAvailability } from './SizeAvailability';

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column("enum", { enum: ProductCategory })
  category!: ProductCategory;

  @Column("enum", { enum: Collection, array: true })
  collections!: Collection[];

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @OneToMany(() => SizeAvailability, (sizeAvailability) => sizeAvailability.product, { cascade: true })
  sizeAvailabilities!: SizeAvailability[];

  @Column("enum", { enum: AvailabilityStatus, nullable: true })
  availability_status!: AvailabilityStatus;

  @ManyToMany(() => Image, { cascade: true })
  @JoinTable()
  images!: Image[];

  @Column()
  color!: string;

  @Column()
  createdById!: string;

  @Column({ type: "timestamp", nullable: true })
  createdDate?: Date;

  @Column({ type: "timestamp", nullable: true })
  lastModifiedDate?: Date;
}
