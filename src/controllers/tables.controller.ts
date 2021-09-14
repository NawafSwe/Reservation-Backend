import Table from '../models/table.model';
import * as tableServices from '../services/table.service';
export const getAllTables = async () => {
    try {
        return await tableServices.getTables();

    } catch (error) {
        console.log(`error occurred at tableControllers, at getAllTables, error: ${error}`);
    }
};

export const createTable = async (id: string, body: Table) => {
    try {
        return await tableServices.createTable(id, body);

    } catch (error) {
        console.log(`error occurred at tableControllers, at createTable, error: ${error}`);
    }
};

export const getTableById = async (id: string) => {
    try {
        return await tableServices.getTableById(id);

    } catch (error) {
        console.log(`error occurred at tableControllers, at getTableById, error: ${error}`);
    }
};

export const updateTableById = async (id: string, body: Table) => {
    try {
        return await tableServices.updateTableById(id, body);
    } catch (error) {
        console.log(`error occurred at table controllers, at updateTableById, error: ${error}`);
    }
};


// TODO: if table have future reservations do not delete it 
export const deleteTableById = async (id:string) => {
    try {
        return await tableServices.deleteTableById(id);

    } catch (error) {
        console.log(`error occurred at table controllers, at deleteTableById,error:${error}`);
    }
 };