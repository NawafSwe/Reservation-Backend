import Reservation from '../models/reservation.model';
import * as reservationServices from '../services/reservation.service';
import * as restaurantServices from '../services/restaurant.service';
import * as tableServices from '../services/table.service';
import dayjs from 'dayjs';
export const getAllReservation = async () => {
    try {
        return await reservationServices.getAllReservations();
    } catch (error) {
        console.error(`error occurred at reservations controllers, at getAllReservation, error: ${error}`);
    }
};
export const reserveTable = async (id: string, reservationData: Reservation) => {
    try {
        // obtain id of restaurant , to choose which table 
        const findTable = await tableServices.getTableById(id);
        if (!findTable) {
            // return not found
            return;
        }
        // converting time into hours for human readable dates 24 hours system
        const reservationStartingDateString = dayjs(reservationData.staringHoursDate).format('HH:mm');
        const reservationEndingDateString = dayjs(reservationData.endingHoursDate).format('HH:mm');
        reservationData.startingHoursString = reservationStartingDateString;
        reservationData.endingDateHoursString = reservationEndingDateString;
        // controller vars 
        const isInBeforeRestaurantWorkingHours = reservationStartingDateString < findTable.restaurant.startingWorkingHoursString;
        const isAfterRestaurantWorkingHours = reservationEndingDateString > findTable.restaurant.endingWorkingHoursString;


        if (isInBeforeRestaurantWorkingHours || isAfterRestaurantWorkingHours) {
            // reject
            console.log(`error conflict for timing for restaurant working hours`);
            return;
        }

        const findReservationConflictResponse = await reservationServices.findReservationConflict(id, reservationData);
        // check if table have any reservation conflicts 
        if (findReservationConflictResponse.length > 0) {
            return { message: 'conflicts', list: findReservationConflictResponse };
        }

        // choose table before enter create reservation controller
        // else proceed 
        // do business logic before moving ahead, check, if the reservation conflicts with restaurant working hours, then if the table have reservation at that time.
        const reservationResponse = await reservationServices.createReservation(findTable, reservationData);
        if (!reservationResponse) {
            console.log(`cloud not find table suitable for given conditions`);
            return
        }
        return reservationResponse;
    } catch (error) {
        console.error(`error occurred at reservations controllers, at reserveTable, error: ${error}`);
    }
};

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
        console.error(`error occurred at reservation controllers, at deleteReservationById, error: ${error}`);
    }
};

export const listAllAvailableReservations = async (id: string, reservationData: Reservation) => {
    try {
        const findRestaurant = await restaurantServices.getRestaurantById(id);
        const response = await reservationServices.listAllAvailableReservations(findRestaurant, reservationData);
        return response;
    } catch (error) {
        console.error(`error occurred at reservation controllers, at listAllAvailableReservations, error: ${error}`)
    }
}