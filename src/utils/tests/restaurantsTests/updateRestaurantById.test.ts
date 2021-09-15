import { HttpStatus } from '../../serverUtils/index';
import getServer from '../testingServer';
import supertest from 'supertest';
import dbConnection from '../../../config/db.config';
import closeConnection from '../../../config/closeConnection.config';
describe('testing update all restaurants functionality', () => {
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
    * @description updating restaurant successfully, body with [name]
    */
    test('update restaurant successfully, returning 200 STATUS', async () => {
        const createRestaurantResponse = await agent.post(url).send({
            "name": "Labira",
            "startingWorkingHoursDate": "2021-09-10 10:00:00",
            "endingWorkingHoursDate": "2021-09-10 23:59:00"
        }).expect(HttpStatus.CREATED.code);
        const restaurantData = createRestaurantResponse.body.data.restaurant;
        const response = await agent.put(`${url}/${restaurantData.id}`).send({ "name": "updated Name" }).expect(HttpStatus.OK.code);
        return response;
    });

    /**
    * @description updating restaurant failed due given wrong id, which is not found
    */

    test('failure during updating restaurant, returning 404 STATUS', async () => {
        const response = await agent.put(`${url}/d89901ed-d8e7-424d-a727-822660d48660`).send({ "name": "Name is name" })
            .expect(HttpStatus.NOT_FOUND.code);
        return response;
    });



    /**
    * @description updating restaurant failed due given wrong date types [name]
    */

    test('failure during updating restaurant, returning 404 STATUS', async () => {
        const response = await agent.put(`${url}/d89901ed-d8e7-424d-a727-822660d48660`).send({ "name": 20489 })
            .expect(HttpStatus.BAD_REQUEST.code);
        return response;
    });


    afterAll(() => {
        app.close();
        return closeConnection();

    });
})


