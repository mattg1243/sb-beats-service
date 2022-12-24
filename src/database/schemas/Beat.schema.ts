import { z, object, TypeOf, string, array, number } from 'zod';
// some fields will be populated automatically upon
// server request such as user / artist, created_at, _id,
// and key in S3 bucket
// TODO: theres gotta be a more DRY way to do this...
// schema for request body of upload beat route
export const uploadBeatSchema = object({
  body: object({
    title: string({
      required_error: 'Title is required',
    }).max(64),
    // TODO: makes this check for image file
    description: string().max(128).default(''),
    genreTags: string(),
    otherTags: string().max(5).optional(),
    tempo: number()
      .positive({ message: 'Tempo must be a postive number' })
      .lt(240, { message: 'Tempo must be less than 240' }),
    key: string().max(2),
  }),
});
// schema of argument passed to the create beat database service function
export const createBeatSchema = object({
  body: object({
    title: string({
      required_error: 'Title is required',
    }).max(64),
    // TODO: makes this check for image file
    artworkKey: string().optional(),
    audioKey: string(),
    artistID: string(),
    artistName: string(),
    description: string().max(128).optional(),
    // these tag fields will be comma seperated values
    genreTags: array(string()).optional(),
    otherTags: array(string()).max(24).optional(),
    tempo: number()
      .positive({ message: 'Tempo must be a postive number' })
      .lt(240, { message: 'Tempo must be less than 240' }),
    key: string().max(2),
  }),
});

export type UploadBeatInput = TypeOf<typeof uploadBeatSchema>['body'];
export type CreateBeatInput = TypeOf<typeof createBeatSchema>['body'];
