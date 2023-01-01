import Beat from '../models/Beat.entity';
import { AppDataSource } from '../dataSource';
import { CreateBeatInput } from '../schemas/Beat.schema';

const beatRepository = AppDataSource.getRepository(Beat);

export const createBeat = async (newBeat: CreateBeatInput) => {
  return (await AppDataSource.manager.save(AppDataSource.manager.create(Beat, newBeat))) as Beat;
};
// gets entire row from table by ID
export const getBeat = async (beatId: string) => {};

export const getAllBeats = async () => {
  return await AppDataSource.manager.find(Beat);
};

export const getAllBeatsByUser = async (userId: string) => {
  return await beatRepository.findBy({ artistID: userId });
};
