import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, Table } from 'typeorm';


@Entity()
export default class Restaurant {
    @PrimaryGeneratedColumn()
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
    @OneToMany(() => Table, (table: Table) => table.restaurant)
    @JoinColumn()
    tables: Array<Table>;
}

