import { HttpStatus } from '../../serverUtils/index';
import getServer from '../testingServer';
import supertest from 'supertest';
import dbConnection from '../../../config/db.config';
import closeConnection from '../../../config/closeConnection.config';
import { adminBody, employeeBody } from '../prepareUsers';


describe('testing delete table by id functionality', () => {
    let agent, app;
    const url = '/tables';
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
    * @description deleting table successfully
    */
    test('deleting table by id successfully, returning 200 STATUS', async () => {
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

        const createTableResponse = await agent.post(url)
            .set('auth', userAuth.token)
            .send({
                "restaurantId": restaurantID,
                "capacity": 2,
                "tableNumber": 6,
            }).expect(HttpStatus.CREATED.code);
        const tableId = createTableResponse.body.data.table.id;

        return await agent
            .delete(`${url}/${tableId}`)
            .set('auth', userAuth.token)
            .expect(HttpStatus.OK.code);


    });

    /**
    * @description failed deleting table due unauthenticated error and invalid id
    */
    test('failed deleting table, returning 401 STATUS', async () => {
        return await agent.delete(`${url}/c2fe86e0-78b6-4623-befa-4bdf65091169`).expect(HttpStatus.UNAUTHORIZED.code);
    });



    /**
    * @description failed deleting table due authority resection where a normal employee trying to consume a resource that only a user with authority of admin can access it  and invalid ID
    */
    test('failed deleting tables, returning 401 STATUS', async () => {
        return await agent.delete(`${url}/c2fe86e0-78b6-4623-befa-4bdf65091169`)
            .set('auth', employeeAuth.token)
            .expect(HttpStatus.UNAUTHORIZED.code);
    });



    /**
     * @description closing db connection
     */
    afterAll(() => {
        app.close();
        return closeConnection();

    });
})


