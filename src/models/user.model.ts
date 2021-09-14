import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from '../utils/types/roles.types';
@Entity()
export default class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    public empNumber: number;

    @Column()
    public password: string;

    // if was not specified then consider as basic emp
    @Column({ default: Roles.BASIC })
    public role: Roles

}