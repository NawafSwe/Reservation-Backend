import { DeleteResult, getRepository } from 'typeorm';
import Restaurant from '../models/restaurant.model';


export const getRestaurants = async (): Promise<Array<Restaurant> | never> => {
    try {
        const restaurants: Array<Restaurant> = await getRepository(Restaurant).find({
            relations: ['tables']
        });
        return restaurants;
    } catch (error) {
        console.error(`error occurred, at restaurant services at getRestaurants function, error: ${error}`);
    }
};

export const createRestaurant = async (restaurant: Restaurant): Promise<Restaurant | never> => {
    try {
        const repository = await getRepository(Restaurant);
        const response = await repository.create(restaurant);
        return await repository.save(response);
    } catch (error) {
        console.error(`error occurred, at restaurant services at createRestaurant function, error: ${error}`);
    }
};



export const getRestaurantById = async (id: string): Promise<Restaurant | never> => {
    try {
        const response: Restaurant = await getRepository(Restaurant).findOne(id, { relations: ['tables'] });
        return response;
    } catch (error) {
        console.error(`error occurred, at restaurant services at getRestaurantById function, error: ${error}`);
    }
};

export const deleteRestaurantById = async (id: string): Promise<DeleteResult | never> => {
    try {
        const response = await getRepository(Restaurant).delete(id);
        return response;
    } catch (error) {
        console.error(`error occurred, at restaurant services at deleteRestaurant function, error: ${error}`);
    }
};

export const updateRestaurantById = async () => { };