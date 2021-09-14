import Table from '../models/table.model';
import Restaurant from '../models/restaurant.model';
import * as restaurantServices from './restaurant.service';
import { DeleteResult, getRepository, UpdateResult } from 'typeorm';
export const getTables = async (): Promise<Array<Table> | never> => {
    try {
        return await getRepository(Table).find({ relations: ['restaurant', 'reservations'] });
    } catch (error) {
        console.error(`error occurred at tables services, at getTables, error: ${error}`);
    }
};

/**
 * 
 * @param {string} id of restaurant
 * @param {Table} table data
 */
export const createTable = async (id: string, table: Table): Promise<Table | never> => {
    try {
        const findRestaurant: Restaurant = await restaurantServices.getRestaurantById(id);
        const tableRepository = getRepository(Table);
        const insertTableResponse = tableRepository.create({ ...table, restaurant: findRestaurant });
        await tableRepository.save(insertTableResponse);
        return insertTableResponse;

    } catch (error) {
        console.error(`error occurred at tables services, at createTable, error: ${error}`);
    }
};


export const getTableById = async (id: string): Promise<Table | never> => {
    try {
        return await getRepository(Table).findOne(id, { relations: ['restaurant', 'reservations'] });
    } catch (error) {
        console.error(`error occurred at tables services, at getTableById, error: ${error}`);
    }

};


export const deleteTableById = async (id: string): Promise<DeleteResult | never> => {
    try {
        return await getRepository(Table).delete(id);


    } catch (error) {
        console.error(`error occurred at tables services, at deleteTableById, error: ${error}`);
    }
};

export const updateTableById = async (id: string, table: Table): Promise<UpdateResult | never> => {
    try {
        return await getRepository(Table).update(id, table);
    } catch (error) {
        console.error(`error occurred at tables services, at updateTableById, error: ${error}`);
    }

};