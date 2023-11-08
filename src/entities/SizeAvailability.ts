import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Size, AvailabilityStatus } from './../enums';
import { Product } from './Product';

@Entity()
export class SizeAvailability {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("enum", { enum: Size })
  size!: Size;

  @Column("enum", { enum: AvailabilityStatus, nullable: true })
  availability_status!: AvailabilityStatus;

  @ManyToOne(() => Product, (product) => product.sizeAvailabilities)
  @JoinColumn({ name: "productId" })
  product!: Product;

  @Column()
  productId!: string;
}
