import { createConnection, Connection } from 'typeorm';
const connection = async () => {
    try {
        const createdConnection: Connection = await createConnection();
        console.debug('connection established, successfully to database');
        return createdConnection;
    } catch (error) {
        console.error(`error occurred while trying to establish connection to database, error: ${error}`);
    }
}

export default connection;