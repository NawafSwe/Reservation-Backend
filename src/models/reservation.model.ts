import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, CreateDateColumn, OneToOne } from 'typeorm';
import Table from './table.model';
import TimeSlot from './timeSlot.model';
@Entity()
export default class Reservation {
    // CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; in db side
    @PrimaryGeneratedColumn('uuid')
    public id: string;
    @Column()
    public startingHoursString: string;
    @Column()
    public endingDateHoursString: string;

    @Column()
    public staringHoursDate: Date;

    @Column()
    public endingHoursDate: Date;

    @ManyToOne(() => Table, (table: Table) => table.reservations)
    @JoinColumn()
    public table: Table;

    @Column()
    public numberOfClients: number;

    @Column()
    public createdAtString: string;

    @CreateDateColumn()
    public createdAt: Date;

    @OneToOne(() => TimeSlot, (slot: TimeSlot) => slot)
    @JoinColumn()
    public slot: TimeSlot;
}