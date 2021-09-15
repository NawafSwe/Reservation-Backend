import { HttpStatus } from '../../serverUtils/index';
import getServer from '../testingServer';
import supertest from 'supertest';
import dbConnection from '../../../config/db.config';
import closeConnection from '../../../config/closeConnection.config';
import { adminBody, employeeBody } from '../prepareUsers';


describe('testing get reservation by id functionality', () => {
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
    * @description getting reservation by id successfully
    */
    test('getting reservation by id successfully, returning 200 STATUS', async () => {
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
        const postingReservation = await agent
            .post(`${url}/${tableId}`)
            .set('auth', userAuth.token)
            .send({
                "staringHoursDate": "2021-09-10 16:00:00",
                "endingHoursDate": "2021-09-10 20:00:00",
                "numberOfClients": 1,

            })
            .expect(HttpStatus.CREATED.code);

        await agent
            .get(`${url}/${postingReservation.body.data.reservation.id}`)
            .set('auth', userAuth.token)
            .expect(HttpStatus.OK.code);

    });

    /**
    * @description failed getting reservation by id due unauthenticated error
    */
    test('failed getting reservation by id, returning 401 STATUS', async () => {
        return await agent.get(`${url}/342o2042-e3-403i32-edj`).expect(HttpStatus.UNAUTHORIZED.code);
    });

    /**
    * @description failed getting reservation by id due wrong id
    */
    test('failed getting reservation by id, returning 401 STATUS', async () => {
        return await agent.get(`${url}/bce00b8d-430f-4cbe-afdd-54d5ffc10228`)
            .set('auth', userAuth.token)
            .expect(HttpStatus.NOT_FOUND.code);
    });


    /**
     * @description closing db connection
     */
    afterAll(() => {
        app.close();
        return closeConnection();

    });
})


