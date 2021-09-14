
import Reservation from "../models/reservation.model";
import { getRepository } from 'typeorm';
import Table from '../models/table.model';
import Restaurant from "../models/restaurant.model";
import dayjs from "dayjs";
/**
 * @param skip where from entities should be taken.
 * @param take max number of entities should be taken.
 * @returns 
 * @description finding all reservations 
 */

export const getAllReservations = async (skip?: number, take?: number) => {
    try {

        const reservationRepository = await getRepository(Reservation);
        if (skip && take) {
            return await reservationRepository.findAndCount({
                skip, take, relations: ['table'], where: {
                    // fetching reservation for today
                    createdAtString: dayjs(new Date('2021-08-13T13:38:17.333Z')).format('DD/MM/YYYY')

                }
            });
        } else {

            return await reservationRepository.find({ relations: ['table'], });
        }

    } catch (error) {
        console.log(`error occurred at reservations service, at getAllReservations, error: ${error}`);
    }

};

export const getAllTodayReservation = async () => { };

export const createReservation = async () => { };

export const getReservationById = async () => { };

export const updateReservationById = async () => { };

export const deleteReservationById = async () => { };

export const findConflictReservations = async () => { };

const pickTableForReservation = () => { };