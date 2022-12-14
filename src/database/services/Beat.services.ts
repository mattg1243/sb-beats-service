import Beat from '../models/Beat.entity';
import { AppDataSource } from '../dataSource';
import { UploadBeatInput } from '../schemas/Beat.schema';

const beatRepository = AppDataSource.getRepository(Beat);


export const createBeat = async (beat: UploadBeatInput) => {};
// gets entire row from table by ID
export const getBeatInfo = async (beatId: string) => {};

