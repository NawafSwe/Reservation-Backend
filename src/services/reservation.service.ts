
import Reservation from "../models/reservation.model";
import { DeleteResult, getRepository, UpdateResult } from 'typeorm';
import Table from '../models/table.model';
import Restaurant from "../models/restaurant.model";
import dayjs from "dayjs";
/**
 * @param skip where from entities should be taken.
 * @param take max number of entities should be taken.
 * @returns 
 * @description finding all reservations based on given period or fetch for today 
 */

// TODO: deleted status false 
export const getAllReservations = async (skip?: number, take?: number, period?: Date): Promise<any | never> => {
    try {

        const reservationRepository = await getRepository(Reservation);
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

export const createReservation = async (restaurant: Restaurant, reservation: Reservation): Promise<Reservation | never> => {
    try {
        const findTable: Table = await pickTableForReservation(restaurant.tables, reservation);
        if (findTable) {
            const reservationRepository = await getRepository(Reservation);
            const reservationCreationResult = await reservationRepository.create({ ...reservation, table: findTable, createdAtString: dayjs(new Date()).format('DD/MM/YYYY') });
            return await reservationRepository.save(reservationCreationResult);
        }
        else null;
    } catch (error) {
        console.error(`error occurred at reservation services, at createReservation, error: ${error}`);
    }
};

export const getReservationById = async (id: string): Promise<Reservation | never> => {
    try {
        const reservationRepository = await getRepository(Reservation);
        return await reservationRepository.findOne(id, { relations: ['table'] });
    } catch (error) {
        console.error(`error occurred at reservation services, getReservationById, error: ${error}`);
    }

};

export const updateReservationById = async (id: string, body: Reservation): Promise<UpdateResult | never> => {
    try {
        const reservationRepository = await getRepository(Reservation);
        return await reservationRepository.update(id, body);

    } catch (error) {
        console.error(`error occurred at reservation services, updateReservationById, error: ${error}`);
    }
};

// TODO: soft delete, to keep record in 
export const deleteReservationById = async (id: string): Promise<DeleteResult | never> => {
    try {
        const reservationRepository = await getRepository(Reservation);
        return await reservationRepository.delete(id);

    } catch (error) {
        console.error(`error occurred at reservation services, deleteReservationById, error: ${error}`);
    }
};

export const findConflictReservations = async (tables: Array<Table>, reservationDetails: Reservation): Promise<Array<Reservation | never>> => {
    // ===> query where starting == given starting, ending === giving ending;
    // ===> starting date != existing starting date of reservation
    // ===> ending date of existing reservation can equal starting date of new reservation 
    // ===> ending date cannot be equal to existing ending date of reservation 
    try {
        let selectedTable: Table = pickTableForReservation(tables, reservationDetails);
        if (selectedTable) {
            return await getRepository(Reservation).find(
                {
                    where: [
                        // counting all corresponding times
                        { table: selectedTable, staringHoursDate: reservationDetails.staringHoursDate, endingHoursDate: reservationDetails.endingHoursDate },
                        { table: selectedTable, staringHoursDate: reservationDetails.staringHoursDate },
                        { table: selectedTable, endingHoursDate: reservationDetails.endingHoursDate },
                    ]
                });
        }
        else return [];
    } catch (error) {
        console.error(`error occurred at tables services, at findConflictReservations, error: ${error}`);
    }
};

const pickTableForReservation = (tables: Array<Table>, reservationDetails: Reservation): Table | null => {
    let selectedTable: Table;

    for (const table of tables) {
        // either table full or one seat empty to maximize profit
        if (table.capacity === reservationDetails.numberOfClients + 1 || table.capacity === reservationDetails.numberOfClients) selectedTable = table;
    }
    return selectedTable;
};