
import Reservation from "../models/reservation.model";
import { DeleteResult, getRepository, UpdateResult } from 'typeorm';
import Table from '../models/table.model';
import Restaurant from "../models/restaurant.model";
import * as tableServices from './table.service';
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
dayjs.extend(isBetween);
/**
 * @param skip where from entities should be taken.
 * @param take max number of entities should be taken.
 * @returns 
 * @description finding all reservations based on given period or fetch for today 
 */

export const getAllReservations = async (skip?: number, take?: number, period?: Date): Promise<any | never> => {
    try {

        const reservationRepository = getRepository(Reservation);
        if (skip && take) {
            return await reservationRepository.findAndCount({
                skip, take, relations: ['table'], where: {
                    createdAtString: dayjs(period != null ? period : new Date()).format('DD/MM/YYYY')

                }
            });
        } else {

            return await reservationRepository.find({
                relations: ['table'],
                where: {
                    createdAtString: dayjs(period != null ? period : new Date()).format('DD/MM/YYYY')

                }
            });
        }

    } catch (error) {
        console.log(`error occurred at reservations service, at getAllReservations, error: ${error}`);
    }

};

export const createReservation = async (table: Table, reservation: Reservation): Promise<Reservation | never> => {
    try {
        const reservationRepository = getRepository(Reservation);
        const reservationCreationResult = reservationRepository.create({ ...reservation, table: table, createdAtString: dayjs(new Date()).format('DD/MM/YYYY') });
        return await reservationRepository.save(reservationCreationResult);


    } catch (error) {
        console.error(`error occurred at reservation services, at createReservation, error: ${error}`);
    }
};

export const getReservationById = async (id: string): Promise<Reservation | never> => {
    try {
        const reservationRepository = getRepository(Reservation);
        return await reservationRepository.findOne(id, { relations: ['table'] });
    } catch (error) {
        console.error(`error occurred at reservation services, getReservationById, error: ${error}`);
    }

};

export const updateReservationById = async (id: string, body: Reservation): Promise<UpdateResult | never> => {
    try {
        const reservationRepository = getRepository(Reservation);
        return await reservationRepository.update(id, body);

    } catch (error) {
        console.error(`error occurred at reservation services, updateReservationById, error: ${error}`);
    }
};


export const deleteReservationById = async (id: string): Promise<DeleteResult | never> => {
    try {
        const reservationRepository = getRepository(Reservation);
        return await reservationRepository.delete(id);

    } catch (error) {
        console.error(`error occurred at reservation services, deleteReservationById, error: ${error}`);
    }
};

export const findConflictReservations = async (restaurant: Restaurant, reservationDetails: Reservation): Promise<Array<Reservation | never>> => {
    // ===> query where starting == given starting, ending === giving ending;
    // ===> starting date != existing starting date of reservation
    // ===> ending date of existing reservation can equal starting date of new reservation 
    // ===> ending date cannot be equal to existing ending date of reservation 
    try {

        let listOfTables = await suitableTables(reservationDetails, restaurant);
        const conflictedReservations: Array<Reservation> = [];
        if (listOfTables.length > 0) {
            for (const table of listOfTables) {
                const reservationConflicts = await getRepository(Reservation).find(
                    {
                        where: [
                            // counting all corresponding times
                            { table: table, staringHoursDate: reservationDetails.staringHoursDate, endingHoursDate: reservationDetails.endingHoursDate },
                            { table: table, staringHoursDate: reservationDetails.staringHoursDate },
                            { table: table, endingHoursDate: reservationDetails.endingHoursDate },
                        ]
                    });
                if (reservationConflicts.length > 0) {
                    conflictedReservations.push(...reservationConflicts);
                }
            }
            return conflictedReservations;
        }
        return conflictedReservations;
    } catch (error) {
        console.error(`error occurred at reservations services, at findConflictReservations, error: ${error}`);
    }
};


export const listAllAvailableReservations = async (restaurant: Restaurant, reservationConditions: Reservation) => {
    try {
        const pickTableForReservationResponse = await suitableTables(reservationConditions, restaurant);

        if (!pickTableForReservationResponse) {
            return;
        }
        const availableTimeSlots: any = {};
        availableTimeSlots.tables = [];
        console.log(pickTableForReservationResponse);
        for (const table of pickTableForReservationResponse) {
            // means there is no reservations so from now till the end of the restaurant's working hour should be available
            if (table.reservations.length === 0) {
                availableTimeSlots.tables.push({
                    table: {
                        ...table,
                        availability: [`${dayjs(new Date()).format('HH:mm')} - ${dayjs(restaurant.endingWorkingHoursDate).format('HH:mm')}`]
                    },

                });
            } else {
                // TODO: complete
            }
        }
        return availableTimeSlots;
    } catch (error) {
        console.error(`error occurred at reservations service, at listAllAvailableReservations, error: ${error}`);
    }
}

const suitableTables = async (reservationDetails: Reservation, restaurant: Restaurant): Promise<Array<Table> | never> => {
    try {
        // maximize the profits 🚀
        const numberOfSeats = reservationDetails.numberOfClients + 1;
        // find tables with proper seats 
        const tables: Array<Table> = await getRepository(Table)
            .find({
                where: { capacity: numberOfSeats, restaurant: restaurant },
                relations: ['reservations']
            });
        return tables;
    } catch (error) {
        console.error(`error occurred, at reservations services, at suitableTables, error: ${error}`);
    }
};



export const findReservationConflict = async (id: string, reservationDetails: Reservation) => {
    try {
        const repository = getRepository(Reservation);
        const findTable = await tableServices.getTableById(id);
        if (!findTable) {
            return;
        }
        const conflictsResponse = await repository.find({
            where: [
                // counting all corresponding times
                { table: findTable, staringHoursDate: reservationDetails.staringHoursDate, endingHoursDate: reservationDetails.endingHoursDate },
                { table: findTable, staringHoursDate: reservationDetails.staringHoursDate },
                { table: findTable, endingHoursDate: reservationDetails.endingHoursDate },
            ]
        });
        return conflictsResponse;
    } catch (error) {
        console.error(`error occurred, at reservation services, at findReservationConflict, error: ${error}`);
    }
}