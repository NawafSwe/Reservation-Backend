import { getConnection } from "typeorm";

const closeConnection = async () => {
    try {
        await getConnection().close();
    } catch (error) {
        console.error(`error occurred while trying to closeConnection db connection, error ${error}`);
    }

}

export default closeConnection;
