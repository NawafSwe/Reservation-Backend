import { HttpStatus } from '../../serverUtils/index';
import getServer from '../testingServer';
import supertest from 'supertest';
import dbConnection from '../../../config/db.config';
import closeConnection from '../../../config/closeConnection.config';
import { adminBody } from '../prepareUsers';
import env from 'dotenv';
describe('testing delete a restaurant by id functionality', () => {
    let agent, app, userAuth;
    const url = '/restaurants';
    /**
     * @description setting up server to test functionality
     */
    beforeAll(async () => {
        process.env.NODE_ENV = 'testing';
        env.config();
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
    });

    /**
    * @description delete restaurants successfully
    */
    test('delete restaurant successfully, returning 200 STATUS', async () => {
        const createRestaurantResponse = await agent.post(url)
            .set('auth', userAuth.token)
            .send(
                {
                    "name": "Labira",
                    "startingWorkingHoursDate": "2021-09-10 10:00:00",
                    "endingWorkingHoursDate": "2021-09-10 23:59:00"

                }
            ).expect(HttpStatus.CREATED.code);
        const restaurantId = createRestaurantResponse.body.data.restaurant.id;
        const response = await agent.delete(`${url}/${restaurantId}`).set('auth', userAuth.token).expect(HttpStatus.OK.code);
        expect(response.status).toBe(HttpStatus.OK.code);
        return response;
    });


    /**
    * @description failed to delete restaurant, not found because of wrong id
    */
    test('delete restaurant, returning 404 STATUS', async () => {
        const restaurantId = '82700c8e-824d-44f9-9ce7-34b3026dab94';
        const response = await agent.delete(`${url}/${restaurantId}`)
            .set('auth', userAuth.token)
            .expect(HttpStatus.NOT_FOUND.code);
        return response;
    });


    /**
* @description failed to delete restaurant, not found because of wrong id and unauthorized
*/
    test('delete restaurant, returning 404 STATUS', async () => {
        const restaurantId = '82700c8e-824d-44f9-9ce7-34b3026dab94';
        const response = await agent.delete(`${url}/${restaurantId}`)
            .expect(HttpStatus.UNAUTHORIZED.code);
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


