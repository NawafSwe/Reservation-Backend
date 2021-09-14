import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export const checkJwt = async (req: Request, res: Response, next: NextFunction) => {
    const token = <string>req.headers['auth'];
    let jwtPayload;
    const SECRET = process.env.SECRET;
    // trying to validate the token 
    try {
        jwtPayload = <any>jwt.verify(token, SECRET);
        res.locals.jwtPayload = jwtPayload;
    } catch (error) {
        res.status(401).send({ message: 'unauthorized' });
        return;
    }
    // then the token is valid for certain time
    // send on every request new token  
    const { userId, username } = jwtPayload;
    const newToken = jwt.sign({ userId, username }, SECRET, {
        expiresIn: '6h'// token expires in 6 hours
    });
    // setting the new token into the response
    res.setHeader("token", newToken);
    // call next middleware
    next();
    return;
}