import { HttpStatus } from '../../serverUtils/index';
import getServer from '../testingServer';
import supertest from 'supertest';
import dbConnection from '../../../config/db.config';
import closeConnection from '../../../config/closeConnection.config';
import { adminBody, employeeBody } from '../prepareUsers';
import { getConnection } from 'typeorm';


describe('testing post reservation functionality', () => {
    let agent, app;
    const url = '/reservations';
    let userAuth, employeeAuth;
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

        await agent.post('/users')
        .set('auth', userAuth.token)
        .send(employeeBody)
        .expect(HttpStatus.CREATED.code);
        const employeeAuthenticationResponse = await agent.post('/api/auth/login').send({ empNumber: employeeBody.empNumber, password: employeeBody.password, }).expect(HttpStatus.OK.code);
        employeeAuth = { token: employeeAuthenticationResponse.headers.token };
    });

    /**
    * @description post reservation successfully
    */
    test('post reservation successfully, returning 201 STATUS', async () => {
        // first add restaurant to be able to add table to retrieve it
        const createRestaurantResponse = await agent.post('/restaurants')
            .set('auth', userAuth.token)
            .send({
                "name": "Labira",
                "startingWorkingHoursDate": "2021-09-10 10:00:00",
                "endingWorkingHoursDate": "2021-09-10 23:59:00"

            })
            .expect(HttpStatus.CREATED.code);
        const restaurantID = createRestaurantResponse.body.data.restaurant.id;
        const postTableResponse = await agent.post('/tables')
            .set('auth', userAuth.token)
            .send({
                "restaurantId": restaurantID,
                "capacity": 2,
                "tableNumber": 10,
                "slots": [{
                    "startingDate": "2021-09-10 16:00:00",
                    "endingDate": "2021-09-10 20:00:00"
                }]
            });

        expect(postTableResponse.status).toBe(HttpStatus.CREATED.code);
        const tableId = postTableResponse.body.data.table.id;
        // posting reservation 
        const conflictedReservation = await agent
            .post(`${url}/${tableId}`)
            .set('auth', userAuth.token)
            .send({
                "staringHoursDate": "2021-09-10 16:00:00",
                "endingHoursDate": "2021-09-10 20:00:00",
                "numberOfClients": 1,

            });
        expect(conflictedReservation.status).toBe(HttpStatus.CREATED.code)

    });

    /**
    * @description failed post reservation reservations due unauthenticated error
    */
    test('failed posting reservations, returning 401 STATUS', async () => {
        return await agent.post(`${url}/bce00b8d-430f-4cbe-afdd-54d5ffc10228`)
            .send(
                {
                    "staringHoursDate": "2021-09-10 16:00:00",
                    "endingHoursDate": "2021-09-10 20:00:00",
                    "numberOfClients": 1,

                }
            ).expect(HttpStatus.UNAUTHORIZED.code);
    });

    /**
     * @description failed posting reservation due not valid body schema [numberOfClients as string]
     */

    test(`failed posting new reservation due invalid body, returning 400 STATUS`, async () => {
        // first add restaurant to be able to add table to retrieve it
        const createRestaurantResponse = await agent.post('/restaurants')
            .set('auth', userAuth.token)
            .send({
                "name": "Labira",
                "startingWorkingHoursDate": "2021-09-10 10:00:00",
                "endingWorkingHoursDate": "2021-09-10 23:59:00"

            })
            .expect(HttpStatus.CREATED.code);
        const restaurantID = createRestaurantResponse.body.data.restaurant.id;
        const postTableResponse = await agent.post('/tables')
            .set('auth', userAuth.token)
            .send({
                "restaurantId": restaurantID,
                "capacity": 2,
                "tableNumber": 12,
                "slots": [{
                    "startingDate": "2021-09-10 16:00:00",
                    "endingDate": "2021-09-10 20:00:00"
                }]
            });

        expect(postTableResponse.status).toBe(HttpStatus.CREATED.code);
        const tableId = postTableResponse.body.data.table.id;
        // posting reservation 
        await agent
            .post(`${url}/${tableId}`)
            .set('auth', userAuth.token)
            .send({
                "staringHoursDate": "2021-09-10 16:00:00",
                "endingHoursDate": "2021-09-10 20:00:00",
                "numberOfClients": 'string not valid',

            })
            .expect(HttpStatus.BAD_REQUEST.code);
    });


    /**
    * @description failed posting reservation due not found time slot for particular table
    */
    test(`failed posting reservation due not found time slot for particular table, returning 409 STATUS`, async () => {
        // first add restaurant to be able to add table to retrieve it
        const createRestaurantResponse = await agent.post('/restaurants')
            .set('auth', userAuth.token)
            .send({
                "name": "Labira",
                "startingWorkingHoursDate": "2021-09-10 10:00:00",
                "endingWorkingHoursDate": "2021-09-10 23:59:00"

            })
            .expect(HttpStatus.CREATED.code);
        const restaurantID = createRestaurantResponse.body.data.restaurant.id;
        const postTableResponse = await agent.post('/tables')
            .set('auth', userAuth.token)
            .send({
                "restaurantId": restaurantID,
                "capacity": 2,
                "tableNumber": 100,
                "slots": [{
                    "startingDate": "2021-09-10 10:00:00",
                    "endingDate": "2021-09-10 23:00:00"
                }]
            });

        expect(postTableResponse.status).toBe(HttpStatus.CREATED.code);
        const tableId = postTableResponse.body.data.table.id;
        // posting reservation 
        await agent
            .post(`${url}/${tableId}`)
            .set('auth', userAuth.token)
            .send({
                "staringHoursDate": "2021-09-10 02:00:00",
                "endingHoursDate": "2021-09-10 03:00:00",
                "numberOfClients": 1,

            }).expect(HttpStatus.CONFLICT.code);

    });

    /**
     * @description closing db connection
     */
    afterAll(() => {
        app.close();
        return closeConnection();

    });
})


