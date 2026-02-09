import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column()
  nombre: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  apellido: string;

  @Column({ default: true })
  isActive: boolean;
}
