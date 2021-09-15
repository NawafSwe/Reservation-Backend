import Reservation from '../models/reservation.model';
import * as reservationServices from '../services/reservation.service';
import * as restaurantServices from '../services/restaurant.service';
import * as tableServices from '../services/table.service';
import dayjs from 'dayjs';
import { HttpStatus, APIError, APIResponse } from '../utils/serverUtils/index';
export const getAllReservation = async (): Promise<APIResponse> => {
    try {
        const reservationsList: Array<Reservation> = await reservationServices.getAllReservations();
        return new APIResponse({ reservations: reservationsList }, HttpStatus.OK.code);
    } catch (error) {
        console.error(`error occurred at reservations controllers, at getAllReservation, error: ${error}`);
        return new APIResponse({}, HttpStatus.BAD_REQUEST.code, [new APIError(HttpStatus.BAD_REQUEST, error.message)]);
    }
};
export const reserveTable = async (id: string, reservationData: Reservation): Promise<APIResponse> => {
    try {
        // obtain id of restaurant , to choose which table 
        const findTable = await tableServices.getTableById(id);
        if (!findTable) {
            // return not found
            return new APIResponse({}, HttpStatus.NOT_FOUND.code, [new APIError(HttpStatus.NOT_FOUND, `Table with id: ${id} not found`)]);
        }
        // if capacity not matching conditions, throw an error
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
            return new APIResponse({
                restaurantWorkingHours: `${findTable.restaurant.startingWorkingHoursString} - ${findTable.restaurant.endingWorkingHoursString}`
            }, HttpStatus.CONFLICT.code, [new APIError(HttpStatus.CONFLICT, `reservation cannot be done due timing conflicts with restaurant working hours`)]);
        }

        const findReservationConflictResponse = await reservationServices.findReservationConflict(id, reservationData);
        // check if table have any reservation conflicts 
        if (findReservationConflictResponse.length > 0) {
            return new APIResponse({
                conflictsList: findReservationConflictResponse
            }, HttpStatus.CONFLICT.code, [new APIError(HttpStatus.CONFLICT, `reservation cannot be done due timing conflicts with other reservations`)]);
        }

        // choose table before enter create reservation controller
        // else proceed 
        // do business logic before moving ahead, check, if the reservation conflicts with restaurant working hours, then if the table have reservation at that time.
        const reservationResponse = await reservationServices.createReservation(findTable, reservationData);
        if (!reservationResponse) {
            return new APIResponse({}, HttpStatus.CONFLICT.code, [new APIError(HttpStatus.NOT_FOUND, `Reservation failed`)]);
        }
        return new APIResponse(
            {
                message: `reservation with id: ${reservationResponse.id} was created`,
                reservation: reservationResponse
            }
            , HttpStatus.CREATED.code);;
    } catch (error) {
        console.error(`error occurred at reservations controllers, at reserveTable, error: ${error}`);
        return new APIResponse({}, HttpStatus.BAD_REQUEST.code, [new APIError(HttpStatus.BAD_REQUEST, error.message)]);
    }
};

export const getReservationById = async (id: string): Promise<APIResponse> => {
    try {
        const findReservation: Reservation = await reservationServices.getReservationById(id);
        if (!findReservation) {
            return new APIResponse({}, HttpStatus.NOT_FOUND.code, [new APIError(HttpStatus.NOT_FOUND, `reservation with id: ${id} was not found`)]);
        }
        return new APIResponse({ reservation: findReservation }, HttpStatus.OK.code);
    } catch (error) {
        console.error(`error occurred at reservation controllers, at getReservationById, error: ${error}`);
        return new APIResponse({}, HttpStatus.BAD_REQUEST.code, [new APIError(HttpStatus.BAD_REQUEST, error.message)]);
    }
};

export const updateReservationById = async (id: string, body: Reservation): Promise<APIResponse> => {
    try {
        const updateReservationResult = await reservationServices.updateReservationById(id, body);
        if (updateReservationResult.affected === 0) {
            return new APIResponse({}, HttpStatus.NOT_FOUND.code, [new APIError(HttpStatus.NOT_FOUND, `reservation update with id: ${id} cannot be done at this time`)]);
        }
        return new APIResponse({
            message: 'reservation data updated successfully'
        }, HttpStatus.OK.code);
    } catch (error) {
        console.error(`error occurred at reservation controllers, at getReservationById, error: ${error}`);
        return new APIResponse({}, HttpStatus.BAD_REQUEST.code, [new APIError(HttpStatus.BAD_REQUEST, error.message)]);
    }

};
export const deleteReservationById = async (id: string): Promise<APIResponse> => {
    try {
        const deleteReservationResult = await reservationServices.deleteReservationById(id);
        if (deleteReservationResult.affected === 0) {
            return new APIResponse({}, HttpStatus.NOT_FOUND.code, [new APIError(HttpStatus.NOT_FOUND, `reservation deletion with id: ${id} cannot be done at this time`)]);
        }
        return new APIResponse({
            message: 'reservation data deleted successfully'
        }, HttpStatus.OK.code);
    } catch (error) {
        console.error(`error occurred at reservation controllers, at deleteReservationById, error: ${error}`);
        return new APIResponse({}, HttpStatus.BAD_REQUEST.code, [new APIError(HttpStatus.BAD_REQUEST, error.message)]);
    }
};

export const listAllAvailableReservations = async (id: string, reservationData: Reservation): Promise<APIResponse> => {
    try {
        const findRestaurant = await restaurantServices.getRestaurantById(id);
        if (!findRestaurant) {
            return new APIResponse({}, HttpStatus.NOT_FOUND.code, [new APIError(HttpStatus.NOT_FOUND, `restaurant with id: ${id} was not found`)]);
        }
        const response = await reservationServices.listAllAvailableReservations(findRestaurant, reservationData);
        return new APIResponse(response, HttpStatus.OK.code);
    } catch (error) {
        console.error(`error occurred at reservation controllers, at listAllAvailableReservations, error: ${error}`);
        return new APIResponse({}, HttpStatus.BAD_REQUEST.code, [new APIError(HttpStatus.BAD_REQUEST, error.message)]);
    }
}