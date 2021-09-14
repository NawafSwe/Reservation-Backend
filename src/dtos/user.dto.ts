import { Roles } from '../utils/types/roles.types';
export default class UserDto {
    public id: string;
    public empNumber: number;
    public password: string;
    public role: Roles
}

