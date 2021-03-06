import { UserEntity } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Apartment } from '../../apartment/entities/apartment.entity';

@Entity('owner-place')
export class OwnerApartment {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column()
  address: string;

  // @Column()
  // start: string;

  @Column({ default: false })
  active: boolean;

  @Column()
  phone: string;

  @OneToOne(() => UserEntity, (user) => user.ownerPlace)
  userInfo: UserEntity;

  @OneToMany(() => Apartment, (place) => place.owner)
  apartments: Apartment[];
}
