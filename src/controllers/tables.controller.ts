import Table from '../models/table.model';
import * as tableServices from '../services/table.service';
import { HttpStatus, APIError, APIResponse } from '../utils/serverUtils/index';
import * as restaurantServices from '../services/restaurant.service';
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
        return new APIResponse({ table: createTableResponse }, HttpStatus.CREATED.code);

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