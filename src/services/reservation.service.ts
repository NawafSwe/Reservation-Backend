
import Reservation from "../models/reservation.model";
import { getRepository } from 'typeorm';
import Table from '../models/table.model';
import Restaurant from "../models/restaurant.model";
import dayjs from "dayjs";
/**
 * @param skip where from entities should be taken.
 * @param take max number of entities should be taken.
 * @returns 
 * @description finding all reservations based on given period or fetch for today 
 */

export const getAllReservations = async (skip?: number, take?: number, period?: Date) => {
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

export const createReservation = async (restaurant: Restaurant, reservation: Reservation) => {
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

export const getReservationById = async () => { };

export const updateReservationById = async () => { };

export const deleteReservationById = async () => { };

export const findConflictReservations = async () => { };

const pickTableForReservation = (tables: Array<Table>, reservationDetails: Reservation): Table | null => {
    let selectedTable: Table;

    for (const table of tables) {
        // either table full or one seat empty to maximize profit
        if (table.capacity === reservationDetails.numberOfClients + 1 || table.capacity === reservationDetails.numberOfClients) selectedTable = table;
    }
    return selectedTable;
};