import { Roles } from '../utils/types/roles.types';
import { Request, Response, NextFunction } from 'express';
import { getUserById } from '../services/users.service';
import User from '../models/user.model';
import { HttpStatus } from '../utils/serverUtils/index';
export const checkRole = (roles: Array<Roles>) => async (req: Request, res: Response, next: NextFunction) => {
    // after we have checked user is signed in then get his id to check his role 
    const id = res.locals.jwtPayload.userId;
    let findUser: User;
    try {
        findUser = await getUserById(id);
        if (!findUser) {
            res.status(HttpStatus.NOT_FOUND.code).send({
                message: `User with id: ${id} not found`,
                status: HttpStatus.NOT_FOUND.code
            });
            return;
        }
    } catch (error) {
        res.status(HttpStatus.CONFLICT.code).send({
            message: 'Failed during validating user',
            status: HttpStatus.CONFLICT.code
        });
        return;
    }
    // if we found a user we check his role 
    if (roles.indexOf(findUser.role) > -1) {
        next();
        return;
    } else {
        res.status(HttpStatus.UNAUTHORIZED.code).send(
            {
                message: `user with id: ${id} Unauthorized to do this action`,
                status: HttpStatus.UNAUTHORIZED.code
            }
        )
    }
}