import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import Reservation from './reservation.model';
import Restaurant from './restaurant.model';

@Entity()
export default class TableEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ nullable: false })
    capacity: number;

    @ManyToOne(() => Restaurant, (restaurant: Restaurant) => restaurant.tables)
    restaurant: Restaurant;

    @OneToMany(() => Reservation, (reservation: Reservation) => reservation.table)
    @JoinColumn()
    reservations: Array<Reservation>;
}
