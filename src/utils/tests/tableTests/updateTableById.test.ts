import { HttpStatus } from '../../serverUtils/index';
import getServer from '../testingServer';
import supertest from 'supertest';
import dbConnection from '../../../config/db.config';
import closeConnection from '../../../config/closeConnection.config';
import { adminBody, employeeBody } from '../prepareUsers';


describe('testing update by id table functionality', () => {
    let agent, app;
    const url = '/tables';
    let userAuth, employeeAuth;
    /**
     * @description setting up server to test functionality
     */
    beforeAll(async () => {

        await dbConnection();
        app = getServer();
        app.listen(process.env.TESTING_SERVER_PORT, () => {
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
    * @description updating table successfully
    */
    test('updating table successfully, returning 200 STATUS', async () => {
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

        const postedTableResponse = await agent.post(url)
            .set('auth', userAuth.token)
            .send({
                "restaurantId": restaurantID,
                "capacity": 2,
                "tableNumber": 6,
            })
            .expect(HttpStatus.CREATED.code);
        const { id } = postedTableResponse.body.data.table;

        return await agent.put(`${url}/${id}`)
            .set('auth', userAuth.token)
            .send({ "capacity": 12 })
            .expect(HttpStatus.OK.code)
    });


    /**
    * @description failed updating table due unauthenticated error
    */
    test('failed updating table, returning 401 STATUS', async () => {
        return await agent.put(`${url}/c2fe86e0-78b6-4623-befa-4bdf65091169`)
            .send({
                "restaurantId": '320-43u5y21324t3829-=0jefs',
                "capacity": 2,
                "tableNumber": 6,
            })
            .expect(HttpStatus.UNAUTHORIZED.code);
    });

    /**
    * @description failed updating table due level of authority error
    */
    test('failed updating table, returning 401 STATUS', async () => {
        return await agent.put(`${url}/320-43u5y21324t3829-=0jefs`)
            .set('auth', employeeAuth.token)
            .send({
                "restaurantId": '320-43u5y21324t3829-=0jefs',
                "capacity": 2,
                "tableNumber": 6,
            })
            .expect(HttpStatus.UNAUTHORIZED.code);
    });



    /**
    * @description failed updating table due invalid argument [capacity => should be a number]
    */
    test('failed updating tables, returning 400 STATUS', async () => {
        return await agent.put(`${url}/c2fe86e0-78b6-4623-befa-4bdf65091169`)
            .set('auth', userAuth.token)
            .send({
                "restaurantId": '320-43u5y21324t3829-=0jefs',
                "capacity": 'capacity must be number',
                "tableNumber": 6,
            })
            .expect(HttpStatus.BAD_REQUEST.code);
    });

    /**
    * @description failed updating table due invalid capacity conditions [capacity => should [2,12] ]
    */
    test('failed updating tables, returning 400 STATUS', async () => {
        return await agent.put(`${url}/c2fe86e0-78b6-4623-befa-4bdf65091169`)
            .set('auth', userAuth.token)
            .send({
                "restaurantId": '320-43u5y21324t3829-=0jefs',
                "capacity": 20,
                "tableNumber": 6,
            })
            .expect(HttpStatus.BAD_REQUEST.code);
    });
    /**
    * @description failed updating table due missing arguments [restaurantId => missing]
    */
    test('failed updating tables, returning 400 STATUS', async () => {
        return await agent.post(`${url}`)
            .set('auth', userAuth.token)
            .send({
                "tableNumber": 6,
                "capacity": 5,
            }).expect(HttpStatus.BAD_REQUEST.code);
    });


    /**
    * @description failed updating table due invalid restaurant id
    */
    test('failed updating tables, returning 404 STATUS', async () => {
        return await agent.post(`${url}`)
            .set('auth', userAuth.token)
            .send({
                "tableNumber": 6,
                "capacity": 5,
                "restaurantId": "82700c8e-824d-44f9-9ce7-34b3026dab94"
            }).expect(HttpStatus.NOT_FOUND.code);
    });
    /**
     * @description closing db connection
     */
    afterAll(() => {
        app.close();
        return closeConnection();

    });
})


