import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import Restaurant from './restaurant.model';

@Entity()
export default class TableEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ nullable: false })
    capacity: number;
}
