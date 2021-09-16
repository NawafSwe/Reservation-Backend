import { HttpStatus } from '../../serverUtils/index';
import getServer from '../testingServer';
import supertest from 'supertest';
import dbConnection from '../../../config/db.config';
import closeConnection from '../../../config/closeConnection.config';
import { adminBody, employeeBody } from '../prepareUsers';


describe('testing post table functionality', () => {
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
    * @description posting table successfully
    */
    test('posting table successfully, returning 201 STATUS', async () => {
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

        return await agent.post(url)
            .set('auth', userAuth.token)
            .send({
                "restaurantId": restaurantID,
                "capacity": 2,
                "tableNumber": 6,
            }).expect(HttpStatus.CREATED.code);

    });

    /**
    * @description failed posting table due unauthenticated error
    */
    test('failed posting table, returning 401 STATUS', async () => {
        return await agent.post(`${url}`)
            .send({
                "restaurantId": '320-43u5y21324t3829-=0jefs',
                "capacity": 2,
                "tableNumber": 6,
            })
            .expect(HttpStatus.UNAUTHORIZED.code);
    });

    /**
* @description failed posting table due level of authority error
*/
    test('failed posting table, returning 401 STATUS', async () => {
        return await agent.post(`${url}`)
            .set('auth', employeeAuth.token)
            .send({
                "restaurantId": '320-43u5y21324t3829-=0jefs',
                "capacity": 2,
                "tableNumber": 6,
            })
            .expect(HttpStatus.UNAUTHORIZED.code);
    });



    /**
    * @description failed posting table due invalid argument [capacity => should be a number]
    */
    test('failed posting tables, returning 400 STATUS', async () => {
        return await agent.post(`${url}`)
            .set('auth', userAuth.token)
            .send({
                "restaurantId": '320-43u5y21324t3829-=0jefs',
                "capacity": 'capacity must be number',
                "tableNumber": 6,
            })
            .expect(HttpStatus.BAD_REQUEST.code);
    });

    /**
    * @description failed posting table due invalid capacity conditions [capacity => should [2,12] ]
    */
    test('failed posting tables, returning 400 STATUS', async () => {
        return await agent.post(`${url}`)
            .set('auth', userAuth.token)
            .send({
                "restaurantId": '320-43u5y21324t3829-=0jefs',
                "capacity": 20,
                "tableNumber": 6,
            })
            .expect(HttpStatus.BAD_REQUEST.code);
    });
    /**
    * @description failed posting table due missing arguments [capacity => missing]
    */
    test('failed posting tables, returning 400 STATUS', async () => {
        return await agent.post(`${url}`)
            .set('auth', userAuth.token)
            .send({
                "restaurantId": '320-43u5y21324t3829-=0jefs',
                "tableNumber": 6,
            })
            .expect(HttpStatus.BAD_REQUEST.code);
    });

    /**
    * @description failed posting table due missing arguments [restaurantId => missing]
    */
    test('failed posting tables, returning 400 STATUS', async () => {
        return await agent.post(`${url}`)
            .set('auth', userAuth.token)
            .send({
                "tableNumber": 6,
                "capacity": 5,
            }).expect(HttpStatus.BAD_REQUEST.code);
    });


    /**
    * @description failed posting table due invalid restaurant id
    */
    test('failed posting tables, returning 404 STATUS', async () => {
        return await agent.post(`${url}`)
            .set('auth', userAuth.token)
            .send({
                "tableNumber": 6,
                "capacity": 5,
                "restaurantId": "82700c8e-824d-44f9-9ce7-34b3026dab94"
            }).expect(HttpStatus.NOT_FOUND.code);
    });

    /**
    * @description posting table failed due duplicated table numbers
    */
    test('posting table failed due duplicated table numbers, returning 400 STATUS', async () => {
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

        await agent.post(url)
            .set('auth', userAuth.token)
            .send({
                "restaurantId": restaurantID,
                "capacity": 2,
                "tableNumber": 6,
            })
            .expect(HttpStatus.CONFLICT.code);

        return await agent.post(url)
            .set('auth', userAuth.token)
            .send({
                "restaurantId": restaurantID,
                "capacity": 2,
                "tableNumber": 6,
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


