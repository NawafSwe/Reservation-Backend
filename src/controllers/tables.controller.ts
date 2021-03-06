import Table from '../models/table.model';
import * as tableServices from '../services/table.service';
import { HttpStatus, APIError, APIResponse } from '../utils/serverUtils/index';
import * as restaurantServices from '../services/restaurant.service';
import * as timeSlotsServices from '../services/timeSlot.service';
import dayjs from 'dayjs';
import TimeSlot from '/models/timeSlot.model';
export const getAllTables = async (): Promise<APIResponse> => {
    try {
        const response = await tableServices.getTables();
        return new APIResponse({ tables: response }, HttpStatus.OK.code);

    } catch (error) {
        console.error(`error occurred at tableControllers, at getAllTables, error: ${error}`);
        return new APIResponse({}, HttpStatus.CONFLICT.code, [new APIError(HttpStatus.CONFLICT, error.message)]);
    }
};

export const createTable = async (id: string, body: Table) => {
    try {
        const findRestaurant = await restaurantServices.getRestaurantById(id);
        if (!findRestaurant) {
            return new APIResponse({}, HttpStatus.NOT_FOUND.code, [new APIError(HttpStatus.NOT_FOUND, `filed during creating a table, restaurant with id: ${id} was not found`)]);
        }

        const createTableResponse = await tableServices.createTable(findRestaurant, body);
        if (!createTableResponse) {
            return new APIResponse({}, HttpStatus.CONFLICT.code, [new APIError(HttpStatus.CONFLICT, `failed during table creation`)]);
        }

        let apiResponse = new APIResponse({ table: createTableResponse }, HttpStatus.CREATED.code, []);
        // remove slots from api response, and continue create slots 
        delete apiResponse.data.table.slots;
        const createdSlots: Array<TimeSlot> = [];
        apiResponse.data.table.slots = createdSlots;
        if (body.slots) {
            for (const slot of body.slots) {
                //withing working hours of restaurant
                // converting time into hours for human readable dates 24 hours system
                const slotStartingDateString = dayjs(slot.startingDate).format('HH:mm');
                const slotEndingDateString = dayjs(slot.endingDate).format('HH:mm');
                slot.startingDateString = slotStartingDateString;
                slot.endingDateString = slotEndingDateString;

                // controller vars 
                const isInBeforeRestaurantWorkingHours = slotStartingDateString < findRestaurant.startingWorkingHoursString;
                const isAfterRestaurantWorkingHours = slotEndingDateString > findRestaurant.endingWorkingHoursString;
                if (!(isAfterRestaurantWorkingHours || isInBeforeRestaurantWorkingHours)) {
                    const creatingSlotResponse = await timeSlotsServices.createTimeSlot(createTableResponse, slot);
                    if (!creatingSlotResponse) {
                        apiResponse.errors.push(new APIError(HttpStatus.CONFLICT, `Failed to create the slot with ${slot.startingDate} --- ${slot.endingDate}, try to create it later`));
                    } else {
                        createdSlots.push(slot);
                    }
                } else {
                    apiResponse.errors.push(new APIError(HttpStatus.CONFLICT, `Failed to create the slot with ${slot.startingDate} --- ${slot.endingDate}, because it is conflicting with restaurant working hours`));
                }
            }
        }
        return apiResponse;
    } catch (error) {
        console.error(`error occurred at tableControllers, at createTable, error: ${error}`);
        return new APIResponse({}, HttpStatus.CONFLICT.code, [new APIError(HttpStatus.CONFLICT, error.message)]);
    }
};

export const getTableById = async (id: string) => {
    try {
        const findTable = await tableServices.getTableById(id);
        if (!findTable) {
            return new APIResponse({}, HttpStatus.NOT_FOUND.code, [new APIError(HttpStatus.NOT_FOUND, `table with id ${id} was not found`)]);
        }
        return new APIResponse({ table: findTable }, HttpStatus.OK.code);
    } catch (error) {
        console.error(`error occurred at tableControllers, at getTableById, error: ${error}`);
        return new APIResponse({}, HttpStatus.CONFLICT.code, [new APIError(HttpStatus.CONFLICT, error.message)]);
    }
};

export const updateTableById = async (id: string, body: Table) => {
    try {
        const updateResult = await tableServices.updateTableById(id, body);
        if (updateResult.affected === 0) {
            return new APIResponse({}, HttpStatus.NOT_FOUND.code, [new APIError(HttpStatus.NOT_FOUND, `table update with id: ${id} cannot be done at this time`)]);
        }
        return new APIResponse({
            message: `table data updated successfully, with id: ${id}`
        }, HttpStatus.OK.code);
    } catch (error) {
        console.error(`error occurred at table controllers, at updateTableById, error: ${error}`);
        return new APIResponse({}, HttpStatus.CONFLICT.code, [new APIError(HttpStatus.CONFLICT, error.message)]);
    }
};


export const deleteTableById = async (id: string) => {
    try {
        const findTable = await tableServices.getTableById(id);
        if (!findTable) {
            return new APIResponse({}, HttpStatus.NOT_FOUND.code, [new APIError(HttpStatus.NOT_FOUND, `table deletion with id: ${id} cannot be done because it was not found`)]);
        }
        if (findTable.reservations.length > 0) {
            return new APIResponse({
                reservations: findTable.reservations,
            }, HttpStatus.CONFLICT.code, [new APIError(HttpStatus.CONFLICT, `table deletion with id: ${id} cannot be deleted because it have some reservations`)]);
        }

        const deletionResult = await tableServices.deleteTableById(id);
        if (deletionResult.affected === 0) {
            return new APIResponse({}, HttpStatus.CONFLICT.code, [new APIError(HttpStatus.CONFLICT, `table deletion with id: ${id} cannot be done at this time`)]);
        }

        return new APIResponse({
            message: `table data deleted successfully, with id: ${id}`
        }, HttpStatus.OK.code);

    } catch (error) {
        console.error(`error occurred at table controllers, at deleteTableById,error:${error}`);
        return new APIResponse({}, HttpStatus.BAD_REQUEST.code, [new APIError(HttpStatus.BAD_REQUEST, error.message)]);
    }
};