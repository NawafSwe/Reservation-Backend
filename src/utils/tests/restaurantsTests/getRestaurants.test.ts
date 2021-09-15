import { HttpStatus } from '../../serverUtils/index';
import getServer from '../testingServer';
import supertest from 'supertest';
import dbConnection from '../../../config/db.config';
import closeConnection from '../../../config/closeConnection.config';

describe('testing get all restaurants functionality', () => {
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
    * @description getting restaurants successfully
    */
    test('get restaurants successfully, returning 200 STATUS', async () => {
        await agent.post(url).send(
            {
                "name": "Labira",
                "startingWorkingHoursDate": "2021-09-10 10:00:00",
                "endingWorkingHoursDate": "2021-09-10 23:59:00"

            }
        ).expect(HttpStatus.CREATED.code);
        const response = await agent.get(url).expect(HttpStatus.OK.code);
        console.log(response.body);
        expect(response.status).toBe(HttpStatus.OK.code);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('restaurants');
        // we have added a restaurant
        expect(response.body.data.restaurants.length).toBeGreaterThan(0);
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


