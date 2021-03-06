import { ApiProperty } from '@nestjs/swagger';
import { ROLE } from 'src/common/constant';
import { OwnerApartment } from '../../owner-apartment/entities/owner-apartments.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Admin } from '../../admin/entities/admin.entity';
import { Customer } from './customer.entity';

@Entity({ name: 'user' })
export class UserEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @ApiProperty()
  @Column({ length: 50, nullable: true })
  email: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  password: string;

  @ApiProperty()
  @Column({ length: 50, nullable: true })
  fullName: string;

  @ApiProperty()
  @Column({
    length: 100,
    default:
      'https://res.cloudinary.com/dzbytteef/image/upload/v1632899978/default-user_ron9tg.png',
  })
  avatar: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  address: string;

  @ApiProperty()
  @Column({ length: 50, nullable: true })
  phone: string;

  @ApiProperty()
  @Column('enum', { default: 1, enum: ROLE })
  role: number;

  @ApiProperty()
  @Column('int', { default: 0 })
  money: number;

  @ApiProperty()
  @Column('int', { default: 1, name: 'user_type' })
  userType: number;

  @ApiProperty()
  @Column('boolean', { default: false })
  actived: boolean;

  @ApiProperty()
  @Column('boolean', { default: false })
  approved: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  birthday: Date;

  @ApiProperty()
  @Column({ nullable: true })
  forgotPasswordCode: string;

  @ApiProperty()
  @Column({ length: 50, nullable: true, name: 'code_forgot_password' })
  codeForgotPassword: string;

  @ApiProperty({ nullable: true })
  @Column({ type: 'text', nullable: true, name: 'token_forgot_password' })
  tokenForgotPassword: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => OwnerApartment, (user) => user.userInfo, {
    cascade: true,
  })
  @JoinColumn()
  ownerPlace: OwnerApartment;

  @OneToOne(() => Admin, (user) => user.userInfo, {
    cascade: true,
  })
  @JoinColumn()
  admin: Admin;

  @OneToOne(() => Customer, (user) => user.userInfo, {
    cascade: true,
  })
  @JoinColumn()
  customer: Customer;
}
