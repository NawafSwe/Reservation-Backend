import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from '../utils/types/roles.types';
import bcrypt from 'bcryptjs';
@Entity()
export default class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ unique: true })
    public empNumber: number;

    @Column({ unique: true })
    public username: string;

    @Column()
    public password: string;

    // if was not specified then consider as basic emp
    @Column({ default: Roles.BASIC })
    public role: Roles;

    public async hashPassword(): Promise<void> {
        this.password = await bcrypt.hash(this.password, 8)
    }

    public async isValidPassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }

}