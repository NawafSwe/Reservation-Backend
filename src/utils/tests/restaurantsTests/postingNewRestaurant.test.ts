import { HttpStatus } from '../../serverUtils/index';
import getServer from '../testingServer';
import supertest from 'supertest';
import dbConnection from '../../../config/db.config';
import closeConnection from '../../../config/closeConnection.config';
import { adminBody } from '../prepareUsers';
describe('testing get all restaurants functionality', () => {
    let agent, app, userAuth;
    const url = '/restaurants';
    /**
     * @description setting up server to test functionality
     */
    beforeAll(async () => {

        await dbConnection();
        app = getServer();
        app.listen(process.env.PORT, () => {
            console.log(`server running for testing`);
        });
        agent = supertest(app);
        // prepare a user to be authenticated as ADMIN 
        await agent.post('/admin/addAdmin').send(adminBody).expect(HttpStatus.CREATED.code);
        const authenticationResponse = await agent.post('/api/auth/login').send({ empNumber: adminBody.empNumber, password: adminBody.password, }).expect(HttpStatus.OK.code);
        userAuth = { token: authenticationResponse.headers.token };

    });

    /**
    * @description creating restaurant successfully
    */
    test('create restaurant successfully, returning 201 STATUS', async () => {
        const response = await agent.post(url)
            .set('auth', userAuth.token)
            .send({
                "name": "Labira",
                "startingWorkingHoursDate": "2021-09-10 10:00:00",
                "endingWorkingHoursDate": "2021-09-10 23:59:00"
            }
            )
            .expect(HttpStatus.CREATED.code);
        return response;
    });

    /**
     * @description creating restaurant failed due missing required body params[name]
     */

    test('failure during creating restaurant, returning 400 STATUS', async () => {
        const response = await agent.post(url)
            .set('auth', userAuth.token)
            .send(
                {
                    "startingWorkingHoursDate": "2021-09-10 10:00:00",
                    "endingWorkingHoursDate": "2021-09-10 23:59:00"

                }
            )
            .expect(HttpStatus.BAD_REQUEST.code);
        return response;
    });

    /**
     * @description creating restaurant failed due missing required body params[name,startingWorkingHoursDate]
     */

    test('failure during creating restaurant, returning 400 STATUS', async () => {
        const response = await agent.post(url)
            .set('auth', userAuth.token)
            .send({ "endingWorkingHoursDate": "2021-09-10 23:59:00" }
            ).expect(HttpStatus.BAD_REQUEST.code);
        return response;
    });

    /**
    * @description creating restaurant failed due missing required body params[name,startingWorkingHoursDate,endingWorkingHoursDate]
    */

    test('failure during creating restaurant, returning 400 STATUS', async () => {
        const response = await agent
            .post(url)
            .set('auth', userAuth.token)
            .send({ "name": "Labira", "startingWorkingHoursDate": "2021-09-10 10:00:00" })
            .expect(HttpStatus.BAD_REQUEST.code);
        return response;
    });

    /**
    * @description creating restaurant failed due wrong types for body params[name] putting it as number
    */

    test('failure during creating restaurant, returning 400 STATUS', async () => {
        const response = await agent.post(url)
            .set('auth', userAuth.token)
            .send(
                {
                    "name": 239,
                    "startingWorkingHoursDate": "2021-09-10 10:00:00",
                    "endingWorkingHoursDate": "2021-09-10 23:59:00"
                }
            ).expect(HttpStatus.BAD_REQUEST.code);
        return response;
    });

    /**
    * @description creating restaurant failed due wrong types for body params[name] putting it as number and unauthorized
    */

    test('failure during creating restaurant, returning 400 STATUS', async () => {
        const response = await agent.post(url)
            .send(
                {
                    "name": 239,
                    "startingWorkingHoursDate": "2021-09-10 10:00:00",
                    "endingWorkingHoursDate": "2021-09-10 23:59:00"
                }
            ).expect(HttpStatus.UNAUTHORIZED.code);
        return response;
    });

    afterAll(() => {
        app.close();
        return closeConnection();

    });
})


