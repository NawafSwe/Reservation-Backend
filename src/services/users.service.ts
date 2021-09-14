import User from '../models/user.model';
import { DeleteResult, getRepository, UpdateResult } from 'typeorm';
import UserDto from '../dtos/user.dto';
export const getAllUsers = async (): Promise<Array<User> | never> => {
    try {
        const users = await getRepository(User).find({
            select: ['id', 'empNumber', 'role'] // prevent sending password back
        });
        return users;
    } catch (error) {
        console.error(`error occurred at user services at, getAllUsers function, error: ${error}`);
    }
};

export const getUserById = async (id: string): Promise<User | never> => {
    try {
        const response = await getRepository(User).findOneOrFail(id, {
            select: ['id', 'empNumber', 'role'] // prevent sending password back
        });
        return response;
    } catch (error) {
        console.error(`error occurred at user services at, getUserById function, error: ${error}`);
    }
};
export const createUser = async (user: UserDto): Promise<any | never> => {
    try {
        const userRepository = getRepository(User);
        const createUserResponse = userRepository.create(user);
        // if failed means empNumber is already in use
        const response = await userRepository.save(createUserResponse);
        return { id: response.id, employeeNumber: response.empNumber };

    } catch (error) {
        console.error(`error occurred at user services at,createUser function, error: ${error}`);
    }
};

export const updateUserById = async (id: string, body: UserDto): Promise<UpdateResult | never> => {
    try {
        const response = await getRepository(User).update(id, body);
        return response;

    } catch (error) {
        console.error(`error occurred at user services at, updateUserById function, error: ${error}`);
    }
};
export const deleteUserById = async (id: string): Promise<DeleteResult | never> => {
    try {
        const response = await getRepository(User).delete(id);
        return response;

    } catch (error) {
        console.error(`error occurred at user services at, deleteUserById function, error: ${error}`);
    }

};

export const getUserByEmployeeNumber = async (number: number): Promise<User | never> => {
    try {
        const response = await getRepository(User).findOneOrFail({
            where: {
                empNumber: number
            }
        });
        return response;
    } catch (error) {
        console.error(`error occurred at user services at getUserByEmployeeNumber, error: ${error}`);
        // TODO: return with status 
    }
}