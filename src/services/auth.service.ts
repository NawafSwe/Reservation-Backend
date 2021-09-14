import AuthDto from "dtos/auth.dto";
import { getUserByUsername } from "./users.service";
import User from "../models/user.model";
import * as jwt from 'jsonwebtoken';

export const login = async (authDto: AuthDto): Promise<string | never> => {
    let findUser: User;
    const { password, username } = authDto;
    try {
        // find user by username
        findUser = await getUserByUsername(username);
    } catch (error) {
        console.error(`error occurred, at auth services at login function, error: ${error}`);
        // return 
    }
    if (!findUser.isValidPassword(password)) {
        // return 
        // as wrong password 
    }
    // else create token that valid for six hours
    const token = jwt.sign({ userId: findUser.id, username: findUser.username }, process.env.SECRET, {
        expiresIn: '6h'
    });
    return token;
};
