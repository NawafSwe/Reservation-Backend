import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import Table from './table.model';

@Entity()
export default class Reservation {
    @PrimaryGeneratedColumn()
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
}