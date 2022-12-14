import { z, TypeOf } from 'zod';

// this needs to be super refined...
export const uploadBeatSchema = z.instanceof(File);

export type UploadBeatInput = TypeOf<typeof uploadBeatSchema>;
