import { Roles } from '../utils/types/roles.types';
import { Min, IsInt, Max, Contains, ValidateIf } from 'class-validator';
export default class UserDto {
    public id: string;
    @IsInt()
    @Min(4, { message: 'Employee number must be exactly 4 digits' })
    @Max(4, { message: 'Employee number must be exactly 4 digits' })
    public empNumber: number;
    @Min(6, { message: 'Password must be 6 chars long at least' })
    public password: string;
    @ValidateIf(val => val.value === Roles.ADMIN || val.value === Roles.BASIC)
    public role: Roles
}

