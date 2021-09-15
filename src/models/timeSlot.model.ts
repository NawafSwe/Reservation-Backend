import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from "typeorm";
import Table from './table.model';

@Entity()
export default class TimeSlot {
    @PrimaryGeneratedColumn('uuid')
    public id: string;
    @Column()
    public startingDateString: string;
    @Column()
    public endingDateString: string;

    @Column()
    public startingDate: Date;

    @Column()
    public endingDate: Date;

    @ManyToOne(() => Table, (table: Table) => table.slots)
    @JoinColumn()
    public table: Table;

    // status of time slots, busy or not
    @Column({ default: false })
    public status: boolean;

}