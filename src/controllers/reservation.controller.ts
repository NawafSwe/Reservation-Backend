import Reservation from '../models/reservation.model';
import * as reservationServices from '../services/reservation.service';
export const getAllReservation = async () => {
    try {
        return await reservationServices.getAllReservations();
    } catch (error) {
        console.error(`error occurred at reservations controllers, at getAllReservation, error: ${error}`);
    }
};
export const reserveTable = async () => { };

export const getReservationById = async (id: string) => {
    try {
        return await reservationServices.getReservationById(id);
    } catch (error) {
        console.error(`error occurred at reservation controllers, at getReservationById, error: ${error}`);
    }
};

export const updateReservationById = async (id: string, body: Reservation) => {
    try {
        return await reservationServices.updateReservationById(id, body);
    } catch (error) {
        console.error(`error occurred at reservation controllers, at getReservationById, error: ${error}`);
    }

};
export const deleteReservationById = async (id: string) => {
    try {
        return await reservationServices.deleteReservationById(id);
    } catch (error) {
        console.error(`error occurred at reservation controllers, at deleteReservationById, error: ${error}`)
    }
};