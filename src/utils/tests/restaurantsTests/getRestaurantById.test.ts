import { HttpStatus } from '../../serverUtils/index';
import getServer from '../testingServer';
import supertest from 'supertest';
import dbConnection from '../../../config/db.config';
import closeConnection from '../../../config/closeConnection.config';
import { adminBody } from '../prepareUsers';

describe('testing get a restaurant by id functionality', () => {
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
    * @description getting restaurant by id successfully
    */
    test('get restaurant by id successfully, returning 200 STATUS', async () => {
        const createRestaurantResponse = await agent.post(url)
            .set('auth', userAuth.token)
            .send({
                "name": "Labira",
                "startingWorkingHoursDate": "2021-09-10 10:00:00",
                "endingWorkingHoursDate": "2021-09-10 23:59:00"

            }
            ).expect(HttpStatus.CREATED.code);
        const restaurantId = createRestaurantResponse.body.data.restaurant.id;
        const response = await agent.get(`${url}/${restaurantId}`)
            .set('auth', userAuth.token)
            .expect(HttpStatus.OK.code);
        expect(response.status).toBe(HttpStatus.OK.code);
        return response;
    });


    /**
    * @description failed to get restaurant by id, not found because of wrong id
    */
    test('get restaurant successfully, returning 404 STATUS', async () => {
        const restaurantId = '82700c8e-824d-44f9-9ce7-34b3026dab94';
        const response = await agent.get(`${url}/${restaurantId}`).set('auth', userAuth.token).expect(HttpStatus.NOT_FOUND.code);
        return response;
    });



    /**
    * @description failed to get restaurant by id, not found because of wrong id and unauthorized
    */
    test('get restaurant successfully, returning 404 STATUS', async () => {
        const restaurantId = '82700c8e-824d-44f9-9ce7-34b3026dab94';
        const response = await agent.get(`${url}/${restaurantId}`).expect(HttpStatus.UNAUTHORIZED.code);
        return response;
    });
    /**
     * @description closing db connection
     */
    afterAll(() => {
        app.close();
        return closeConnection();

    });
})


