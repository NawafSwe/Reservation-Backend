import { DeleteResult, getRepository, UpdateResult } from 'typeorm';
import TimeSlot from '../models/timeSlot.model';
import Table from '../models/table.model';


export const getSlots = async (): Promise<Array<TimeSlot> | never> => {
    try {
        const slots: Array<TimeSlot> = await getRepository(TimeSlot).find({
            relations: ['table']
        });
        return slots;
    } catch (error) {
        console.error(`error occurred, at TimeSlots services at getSlots function, error: ${error}`);
    }
};

export const createTimeSlot = async (table: Table, slot: TimeSlot): Promise<TimeSlot | never> => {
    try {
        const repository = getRepository(TimeSlot);
        const isExist = await repository.find({
            where: {
                table: table, startingDate: slot.startingDate, endingDate: slot.endingDate
            }
        });
        if (isExist.length > 0) {
            throw new Error('slot with this time and same table is already exist');
        } else {
            const response = repository.create({ ...slot, table: table });
            const savedSlot = await repository.save(response);
            delete savedSlot.table;
            return savedSlot;
        }
    } catch (error) {
        console.error(`error occurred, at TimeSlots services at createSlot function, error: ${error}`);
    }
};



export const getTimeSlotById = async (id: string): Promise<TimeSlot | never> => {
    try {
        const response: TimeSlot = await getRepository(TimeSlot).findOne(id, { relations: ['table'] });
        return response;
    } catch (error) {
        console.error(`error occurred, at TimeSlots services at getSlotById function, error: ${error}`);
    }
};

export const deleteTimeSlotById = async (id: string): Promise<DeleteResult | never> => {
    try {
        const response = await getRepository(TimeSlot).delete(id);
        return response;
    } catch (error) {
        console.error(`error occurred, at TimeSlots services at deleteSlot function, error: ${error}`);
    }
};

export const updateTimeSlotById = async (id: string, body: TimeSlot): Promise<UpdateResult | never> => {
    try {
        const response = await getRepository(TimeSlot).update(id, body);
        return response;

    } catch (error) {
        console.error(`error occurred, at TimeSlots services at updateTimeSlotsById function, error: ${error}`);
    }
};

export const findTimeSlotByDate = async (start: Date, end: Date, table: Table): Promise<TimeSlot> => {
    try {
        const timeSlotRepository = await getRepository(TimeSlot);
        // time slots do not have overleap slots
        const availableTimeSlots = await timeSlotRepository.find({
            where: { startingDate: start, endingDate: end, table: table, status: false }
        })
        return availableTimeSlots[0];
    } catch (error) {
    }
}