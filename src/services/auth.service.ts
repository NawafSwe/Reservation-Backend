import AuthDto from "dtos/auth.dto";
import { getUserByEmployeeNumber } from "./users.service";
import * as passwordUtils from '../utils/password.util';
import User from "../models/user.model";
import * as jwt from 'jsonwebtoken';

export const login = async (authDto: AuthDto): Promise<string | never> => {
    let findUser: User;
    // password given by user, emp number
    const { password, empNumber } = authDto;
    try {
        // find user by username
        findUser = await getUserByEmployeeNumber(empNumber);
    } catch (error) {
        console.error(`error occurred, at auth services at login function, error: ${error}`);
        // return 
    }
    if (!passwordUtils.isValidPassword(password, findUser.password)) {
        // return 
        // as wrong password 
    }
    // else create token that valid for six hours
    const token = jwt.sign({ userId: findUser.id, username: findUser.empNumber }, process.env.SECRET, {
        expiresIn: '6h'
    });
    return token;
};
