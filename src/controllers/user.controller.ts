import * as userServices from '../services/users.service';
import UserDto from '../dtos/user.dto';
import { hashPassword } from '../utils/password.util';
import { HttpStatus, APIResponse, APIError } from '../utils/serverUtils/index';
export const getAllUsers = async () => {
    try {
        const response = await userServices.getAllUsers();
        return response;
    } catch (error) {
        console.error(`error occurred, at users controllers at getAllUsers, error: ${error}`);
    }
};

export const getUserById = async (id: string) => {
    try {
        const response = await userServices.getUserById(id);
        return response;
    } catch (error) {
        console.error(`error occurred, at users controllers at getUserById, error: ${error}`);
    }
};
export const createUser = async (user: UserDto) => {
    try {

        // check if user exist or no 
        // hash password
        user.password = await hashPassword(user.password)
        const response = await userServices.createUser(user);
        if (!response) {
            return new APIResponse({}, HttpStatus.CONFLICT.code, [new APIError(HttpStatus.CONFLICT, `Cloud not create user, due duplicated employee number`)])
        }
        return new APIResponse({ message: 'User created' }, HttpStatus.CREATED.code);
    } catch (error) {
        console.error(`error occurred, at users controllers at createUser, error : ${error}`);
    }
};

export const updateUserById = async (id: string, user: UserDto) => {
    try {
        // check if there is no conflicts with emp number 
        const response = await userServices.updateUserById(id, user);
        return response;
    } catch (error) {
        console.error(`error occurred, at user controllers at updateUserById, error: ${error}`);
    }
};
export const deleteUserById = async (id: string) => {
    try {
        const response = await userServices.deleteUserById(id);
        return response;
    } catch (error) {
        console.error(`error occurred, at user controllers at deleteUserById, error: ${error}`);
    }
};