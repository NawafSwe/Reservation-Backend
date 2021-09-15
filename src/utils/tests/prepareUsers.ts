import { Roles } from '../types/roles.types'
export const adminBody = {
    "empNumber": 1242,
    "password": "123455",
    "role": Roles.ADMIN,
}

export const employeeBody = {
    "empNumber": 3567,
    "password": "123455",
    "role": Roles.EMPLOYEE
}