import { HttpStatus } from '../../serverUtils/index';
import getServer from '../testingServer';
import supertest from 'supertest';
import dbConnection from '../../../config/db.config';
import closeConnection from '../../../config/closeConnection.config';
import { adminBody } from '../prepareUsers';
describe('testing update all restaurants functionality', () => {
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
    * @description updating restaurant successfully, body with [name]
    */
    test('update restaurant successfully, returning 200 STATUS', async () => {
        const createRestaurantResponse = await agent.post(url)
            .set('auth', userAuth.token)
            .send({
                "name": "Labira",
                "startingWorkingHoursDate": "2021-09-10 10:00:00",
                "endingWorkingHoursDate": "2021-09-10 23:59:00"
            }).expect(HttpStatus.CREATED.code);
        const restaurantData = createRestaurantResponse.body.data.restaurant;
        const response = await agent.put(`${url}/${restaurantData.id}`)
            .set('auth', userAuth.token)
            .send({ "name": "updated Name" }).expect(HttpStatus.OK.code);
        return response;
    });

    /**
    * @description updating restaurant failed due given wrong id, which is not found
    */

    test('failure during updating restaurant, returning 404 STATUS', async () => {
        const response = await agent.put(`${url}/d89901ed-d8e7-424d-a727-822660d48660`)
            .set('auth', userAuth.token)
            .send({ "name": "Name is name" })
            .expect(HttpStatus.NOT_FOUND.code);
        return response;
    });



    /**
    * @description updating restaurant failed due given wrong date types [name]
    */

    test('failure during updating restaurant, returning 404 STATUS', async () => {
        const response = await agent.put(`${url}/d89901ed-d8e7-424d-a727-822660d48660`)
            .set('auth', userAuth.token)
            .send({ "name": 20489 })
            .expect(HttpStatus.BAD_REQUEST.code);
        return response;
    });

    /**
    * @description updating restaurant failed due given wrong date types [name] and unAuthorized
    */

    test('failure during updating restaurant, returning 404 STATUS', async () => {
        const response = await agent.put(`${url}/d89901ed-d8e7-424d-a727-822660d48660`)
            .send({ "name": 20489 })
            .expect(HttpStatus.UNAUTHORIZED.code);
        return response;
    });

    afterAll(() => {
        app.close();
        return closeConnection();

    });
})


