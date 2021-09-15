import { HttpStatus } from '../../serverUtils/index';
import getServer from '../testingServer';
import supertest from 'supertest';
import dbConnection from '../../../config/db.config';
import closeConnection from '../../../config/closeConnection.config';

describe('testing get a restaurant by id functionality', () => {
    let agent, app;
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

    });

    /**
    * @description getting restaurant by id successfully
    */
    test('get restaurant by id successfully, returning 200 STATUS', async () => {
        const createRestaurantResponse = await agent.post(url).send(
            {
                "name": "Labira",
                "startingWorkingHoursDate": "2021-09-10 10:00:00",
                "endingWorkingHoursDate": "2021-09-10 23:59:00"

            }
        ).expect(HttpStatus.CREATED.code);
        const restaurantId = createRestaurantResponse.body.data.restaurant.id;
        const response = await agent.get(`${url}/${restaurantId}`).expect(HttpStatus.OK.code);
        expect(response.status).toBe(HttpStatus.OK.code);
        return response;
    });


    /**
    * @description failed to get restaurant by id, not found because of wrong id
    */
    test('get restaurant successfully, returning 404 STATUS', async () => {
        const restaurantId = 'SaryISTheBEST';
        const response = await agent.get(`${url}/${restaurantId}`).expect(HttpStatus.NOT_FOUND.code);
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


