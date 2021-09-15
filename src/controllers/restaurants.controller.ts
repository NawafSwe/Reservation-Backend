import Restaurant from "../models/restaurant.model";
import * as restaurantServices from '../services/restaurant.service';
import { HttpStatus, APIError, APIResponse } from '../utils/serverUtils/index';
import dayjs from 'dayjs';
export const getAllRestaurants = async (): Promise<APIResponse> => {
    try {
        const restaurants = await restaurantServices.getRestaurants();
        return new APIResponse({
            restaurants: restaurants
        }, HttpStatus.OK.code);
    } catch (error) {
        console.error(`error occurred at restaurant controllers, at getAllRestaurants, error: ${error}`);
        return new APIResponse({}, HttpStatus.CONFLICT.code, [new APIError(HttpStatus.CONFLICT, error.message)]);
    }
};
export const createRestaurant = async (restaurant: Restaurant) => {
    try {
        // convert time into hours format 
        restaurant.startingWorkingHoursString = dayjs(restaurant.startingWorkingHoursDate).format('HH:mm');
        restaurant.endingWorkingHoursString = dayjs(restaurant.endingWorkingHoursDate).format('HH:mm');
        const createRestaurantResponse = await restaurantServices.createRestaurant(restaurant);
        if (!createRestaurantResponse) {
            return new APIResponse({}, HttpStatus.CONFLICT.code, [new APIError(HttpStatus.CONFLICT, `failed in creating restaurant`)]);
        }
        return new APIResponse({ restaurant: createRestaurantResponse }, HttpStatus.CREATED.code);
    } catch (error) {
        console.error(`error occurred at restaurant controllers, at createRestaurant, error: ${error}`);
        return new APIResponse({}, HttpStatus.CONFLICT.code, [new APIError(HttpStatus.CONFLICT, error.message)]);
    }
};

export const getRestaurantById = async (id: string): Promise<APIResponse> => {
    try {
        const findRestaurant = await restaurantServices.getRestaurantById(id);
        if (!findRestaurant) {
            return new APIResponse({}, HttpStatus.NOT_FOUND.code, [new APIError(HttpStatus.NOT_FOUND, `restaurant with ${id}, could not be located`)]);
        }
        return new APIResponse({ restaurant: findRestaurant }, HttpStatus.OK.code);
    } catch (error) {
        console.error(`error occurred at restaurant controllers, at getRestaurantById, error: ${error}`);
        return new APIResponse({}, HttpStatus.CONFLICT.code, [new APIError(HttpStatus.CONFLICT, error.message)]);
    }
};

export const deleteRestaurantById = async (id: string) => {
    try {
        const deleteResult = await restaurantServices.deleteRestaurantById(id);
        if (deleteResult.affected === 0) {
            return new APIResponse({}, HttpStatus.NOT_FOUND.code, [new APIError(HttpStatus.NOT_FOUND, `restaurant deletion with id: ${id} cannot be done at this time`)]);
        }
        return new APIResponse({
            message: `restaurant data deleted successfully, with id: ${id}`
        }, HttpStatus.OK.code);
    } catch (error) {
        console.error(`error occurred at restaurant controllers, at deleteRestaurantById, error: ${error}`);
        return new APIResponse({}, HttpStatus.CONFLICT.code, [new APIError(HttpStatus.CONFLICT, error.message)]);
    }
};


export const updateRestaurantById = async (id: string, body: Restaurant) => {
    try {
        // formatting date again if there is changes 
        if (body.startingWorkingHoursDate) {
            body.startingWorkingHoursString = dayjs(body.startingWorkingHoursDate).format('HH:mm');
        }
        if (body.endingWorkingHoursDate) {
            body.endingWorkingHoursString = dayjs(body.endingWorkingHoursDate).format('HH:mm');
        }
        const updateResult = await restaurantServices.updateRestaurantById(id, body);
        if (updateResult.affected === 0) {
            return new APIResponse({}, HttpStatus.NOT_FOUND.code, [new APIError(HttpStatus.NOT_FOUND, `restaurant update with id: ${id} cannot be done at this time`)]);
        }
        return new APIResponse({
            message: `restaurant data updated successfully, with id: ${id}`
        }, HttpStatus.OK.code);
    } catch (error) {
        console.error(`error occurred at restaurant controllers, at updateRestaurantById, error: ${error}`);
        return new APIResponse({}, HttpStatus.CONFLICT.code, [new APIError(HttpStatus.CONFLICT, error.message)]);
    }
};
