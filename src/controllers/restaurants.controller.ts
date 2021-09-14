import Restaurant from "../models/restaurant.model";
import * as restaurantServices from '../services/restaurant.service';
import dayjs from 'dayjs';
export const getAllRestaurants = async () => {
    try {
        return await restaurantServices.getRestaurants();
    } catch (error) {
        console.error(`error occurred at restaurant controllers, at getAllRestaurants, error: ${error}`);
    }
 };
export const createRestaurant = async (restaurant: Restaurant) => {
    try {
        // convert time into hours format 
        restaurant.startingWorkingHoursString = dayjs(restaurant.startingWorkingHoursDate).format('HH:mm');
        restaurant.endingWorkingHoursString = dayjs(restaurant.endingWorkingHoursDate).format('HH:mm');
        return await restaurantServices.createRestaurant(restaurant);
    } catch (error) {
        console.error(`error occurred at restaurant controllers, at createRestaurant, error: ${error}`);
    }
 };

export const getRestaurantById = async (id: string) => { 
    try {
        return await restaurantServices.getRestaurantById(id);
    } catch (error) {
        console.error(`error occurred at restaurant controllers, at getRestaurantById, error: ${error}`);
    }
};

export const deleteRestaurantById = async (id: string) => { 
    try {
        return await restaurantServices.deleteRestaurantById(id);
    } catch (error) {
        console.error(`error occurred at restaurant controllers, at deleteRestaurantById, error: ${error}`);
    }
};


export const updateRestaurantById = async (id: string,body: Restaurant) => { 
    try {
        // formatting date again if there is changes 
        if (body.startingWorkingHoursDate) {
            body.startingWorkingHoursString = dayjs(body.startingWorkingHoursDate).format('HH:mm');
        }
        if (body.endingWorkingHoursDate) {
            body.endingWorkingHoursString = dayjs(body.endingWorkingHoursDate).format('HH:mm');
        }
        return await restaurantServices.updateRestaurantById(id, body);
    } catch (error) {
        console.error(`error occurred at restaurant controllers, at updateRestaurantById, error: ${error}`);
    }
};
