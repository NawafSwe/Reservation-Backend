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
    * @description creating restaurant successfully
    */
    test('create restaurant successfully, returning 201 STATUS', async () => {
        const response = await agent.post(url).send(
            {
                "name": "Labira",
                "startingWorkingHoursDate": "2021-09-10 10:00:00",
                "endingWorkingHoursDate": "2021-09-10 23:59:00"

            }
        ).expect(HttpStatus.CREATED.code);
        return response;
    });

    /**
     * @description creating restaurant failed due missing required body params[name]
     */

    test('failure during creating restaurant, returning 400 STATUS', async () => {
        const response = await agent.post(url).send(
            {
                "startingWorkingHoursDate": "2021-09-10 10:00:00",
                "endingWorkingHoursDate": "2021-09-10 23:59:00"

            }
        ).expect(HttpStatus.BAD_REQUEST.code);
        return response;
    });

    /**
     * @description creating restaurant failed due missing required body params[name,startingWorkingHoursDate]
     */

    test('failure during creating restaurant, returning 400 STATUS', async () => {
        const response = await agent.post(url).send(
            {
                "endingWorkingHoursDate": "2021-09-10 23:59:00"

            }
        ).expect(HttpStatus.BAD_REQUEST.code);
        return response;
    });

    /**
    * @description creating restaurant failed due missing required body params[name,startingWorkingHoursDate,endingWorkingHoursDate]
    */

    test('failure during creating restaurant, returning 400 STATUS', async () => {
        const response = await agent.post(url).send(
            {

                "name": "Labira",
                "startingWorkingHoursDate": "2021-09-10 10:00:00",

            }
        ).expect(HttpStatus.BAD_REQUEST.code);
        return response;
    });

    /**
    * @description creating restaurant failed due wrong types for body params[name] putting it as number
    */

    test('failure during creating restaurant, returning 400 STATUS', async () => {
        const response = await agent.post(url).send(
            {

                "name": 239,
                "startingWorkingHoursDate": "2021-09-10 10:00:00",
                "endingWorkingHoursDate": "2021-09-10 23:59:00"

            }
        ).expect(HttpStatus.BAD_REQUEST.code);
        return response;
    });

    afterAll(() => {
        app.close();
        return closeConnection();

    });
})


