import UserDto from '@/dtos/user.dto';
import { Roles } from '@/utils/types/roles.types';
import { Request, Response, NextFunction } from 'express';
import { getUserById } from '../services/users.service';


export const checkRole = (roles: Array<Roles>) => async (req: Request, res: Response, next: NextFunction) => {
    // after we have checked user is signed in then get his id to check his role 
    const id = res.locals.jwtPayload.userId;
    let findUser: UserDto;
    try {
        findUser = await getUserById(id);
        if (!findUser) {
            res.status(401).send({
                message: 'user not found'
            });
            return;
        }
    } catch (error) {
        res.status(401).send({
            message: 'failed during verify user authority'
        });
        return;
    }
    // if we found a user we check his role 
    if (roles.indexOf(findUser.role) > -1) {
        next();
        return;
    } else {
        res.status(401).send({ message: 'unauthorized' })
    }
}