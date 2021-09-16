import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm';
import Table from './table.model';

@Entity()
export default class Restaurant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    startingWorkingHoursString: string;

    @Column()
    endingWorkingHoursString: string;

    @Column()
    startingWorkingHoursDate: Date;

    @Column()
    endingWorkingHoursDate: Date;

    // handling tables of restaurant
    @OneToMany(() => Table, (table: Table) => table.restaurant)
    @JoinColumn()
    tables: Array<Table>;
}

