import { HttpStatus } from '../../serverUtils/index';
import getServer from '../testingServer';
import supertest from 'supertest';
import dbConnection from '../../../config/db.config';
import closeConnection from '../../../config/closeConnection.config';
import { adminBody, employeeBody } from '../prepareUsers';
import { getConnection } from 'typeorm';


describe('testing update reservation functionality', () => {
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
        await agent.post('/users').send(adminBody).expect(HttpStatus.CREATED.code);
        await agent.post('/users').send(employeeBody).expect(HttpStatus.CREATED.code);
        const authenticationResponse = await agent.post('/api/auth/login').send({ empNumber: adminBody.empNumber, password: adminBody.password, }).expect(HttpStatus.OK.code);
        userAuth = { token: authenticationResponse.headers.token };
        const employeeAuthenticationResponse = await agent.post('/api/auth/login').send({ empNumber: employeeBody.empNumber, password: employeeBody.password, }).expect(HttpStatus.OK.code);
        employeeAuth = { token: employeeAuthenticationResponse.headers.token };
    });

    /**
    * @description update reservation successfully
    */
    test('update reservation successfully, returning 200 STATUS', async () => {
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
                },
                {
                    "startingDate": "2021-09-10 20:00:00",
                    "endingDate": "2021-09-10 21:00:00"
                }
                ]
            });

        expect(postTableResponse.status).toBe(HttpStatus.CREATED.code);
        const tableId = postTableResponse.body.data.table.id;
        // posting reservation 
        const reservation = await agent
            .post(`${url}/${tableId}`)
            .set('auth', userAuth.token)
            .send({
                "staringHoursDate": "2021-09-10 16:00:00",
                "endingHoursDate": "2021-09-10 20:00:00",
                "numberOfClients": 1,

            });
        expect(reservation.status).toBe(HttpStatus.CREATED.code);

        const updatedReservation = await agent
            .put(`${url}/${reservation.body.data.reservation.id}`)
            .set('auth', userAuth.token)
            .send({
                "staringHoursDate": "2021-09-10 20:00:00",
                "endingHoursDate": "2021-09-10 21:00:00",
                "numberOfClients": 1,

            });
            expect(updatedReservation.status).toBe(HttpStatus.OK.code);

    });

    /**
    * @description failed update reservation reservations due unauthenticated error
    */
    test('failed update reservation, returning 401 STATUS', async () => {
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
     * @description failed update reservation due not valid body schema [numberOfClients as string]
     */

    test(`failed update reservation due invalid body, returning 400 STATUS`, async () => {
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
        // putting reservation 
        await agent
            .put(`${url}/${tableId}`)
            .set('auth', userAuth.token)
            .send({
                "staringHoursDate": "2021-09-10 16:00:00",
                "endingHoursDate": "2021-09-10 20:00:00",
                "numberOfClients": 'string not valid',

            })
            .expect(HttpStatus.BAD_REQUEST.code);
    });

    /**
     * @description closing db connection
     */
    afterAll(() => {
        app.close();
        return closeConnection();

    });
})


