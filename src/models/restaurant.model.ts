import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn } from 'typeorm';


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
}

