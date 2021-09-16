import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import Reservation from './reservation.model';
import Restaurant from './restaurant.model';
import TimeSlot from './timeSlot.model';

@Entity()
export default class TableEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // a table has a number
    @Column({ unique: true })
    tableNumber: number;
    // represents the number of seats
    @Column({ nullable: false })
    capacity: number;

    // linking restaurant info
    @ManyToOne(() => Restaurant, (restaurant: Restaurant) => restaurant.tables)
    restaurant: Restaurant;

    // handling reservations information
    @OneToMany(() => Reservation, (reservation: Reservation) => reservation.table)
    @JoinColumn()
    reservations: Array<Reservation>;

    // handling time slots available for table
    @OneToMany(()=>TimeSlot, (slots:TimeSlot) => slots.table)
    @JoinColumn()
    slots:Array<TimeSlot>;
}
