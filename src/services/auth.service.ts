import AuthDto from "dtos/auth.dto";
import { getUserByEmployeeNumber } from "./users.service";
import * as passwordUtils from '../utils/password.util';
import User from "../models/user.model";
import * as jwt from 'jsonwebtoken';
import { HttpStatus, APIResponse, APIError } from "../utils/serverUtils/index"
export const login = async (authDto: AuthDto): Promise<APIResponse | never> => {
    let findUser: User;
    // password given by user, emp number
    const { password, empNumber } = authDto;
    try {
        // find user by username
        findUser = await getUserByEmployeeNumber(empNumber);
        if (!findUser) {
            return new APIResponse({}, HttpStatus.NOT_FOUND.code, [new APIError(HttpStatus.NOT_FOUND, `user with number: ${empNumber} was not found`)]);
        }
    } catch (error) {
        console.error(`error occurred, at auth services at login function, error: ${error}`);
        // return 
        return new APIResponse({}, HttpStatus.NOT_FOUND.code, [new APIError(HttpStatus.NOT_FOUND, `user with number: ${empNumber} was not found`)]);
    }
    if (!passwordUtils.isValidPassword(password, findUser.password)) {
        // using or to increase security and make attacker do not know which one is wrong 😂
        return new APIResponse({}, HttpStatus.CONFLICT.code, [new APIError(HttpStatus.NOT_FOUND, `wrong employee number or password make sure to enter proper ones`)]);
    }
    // else create token that valid for six hours
    const token = jwt.sign({ userId: findUser.id, username: findUser.empNumber }, process.env.SECRET, {
        expiresIn: '6h'
    });
    const apiResponse = new APIResponse({ message: `Welcome ${empNumber} to our restaurant services you are logged in successfully`, token: token }, HttpStatus.OK.code);
    // setting headers contain token

    return apiResponse;
};
