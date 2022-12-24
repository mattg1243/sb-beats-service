import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { uploadFileToS3 } from '../bucket/upload';
import { createBeat, getAllBeats } from '../database/services/Beat.services';
import { verifyJwt } from '../utils/jwt';
import { UploadBeatInput } from '../database/schemas/Beat.schema';

export const indexHandler = (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json({ message: 'Service online!' });
};

export const uploadBeatHandler = async (req: Request<{}, {}, UploadBeatInput>, res: Response) => {
  // upload the beat to S3 and get its key
  const uploadTimer = '---  file uploaded to bucket in:';
  console.time(uploadTimer);

  const { title, description, genreTags, otherTags, tempo, key } = req.body;
  const token = req.cookies['sb-access-token'];

  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const beat = files['audio'][0];
    const artwork = files['artwork'][0];

    try {
      // upload the files to the S3 bucket and save the Keys
      const beatUploadResponse = await uploadFileToS3(beat);
      if (!beatUploadResponse) {
        console.log('error uploading audio file to S3');
        return res.status(500).json('error uploading audio file to S3');
      }
      const audioKey = beatUploadResponse?.Key;
      console.log('Beat Upload Response: ', beatUploadResponse);

      let artworkKey: string | undefined = undefined;
      if (artwork) {
        const artworkUploadResponse = await uploadFileToS3(artwork);
        artworkKey = artworkUploadResponse?.Key;
      } else {
        console.log('error uploading artwork file to S3');
        return res.status(500).json('error uploading artwork file to S3');
      }
      // now need to create an SQL row and store the filepath there
      console.timeEnd(uploadTimer);
      console.log('file(s) uploaded: ');
      // get the necessary user info
      const userFromCookie = verifyJwt(token);
      if (!userFromCookie) {
        console.log('error decoding user data from token');
        return res.status(500).json('error decoding user data from token');
      }
      const userInfo = userFromCookie.user;
      console.log(userFromCookie);
      // save the beat data to the sql table
      const newBeat = await createBeat({
        title: title,
        description: description,
        artistID: userInfo.id,
        artistName: userInfo.artistName,
        audioKey: audioKey,
        artworkKey: artworkKey,
        genreTags: JSON.parse(genreTags),
        otherTags: otherTags ? JSON.parse(otherTags) : null,
        tempo: tempo,
        key: key,
      });

      console.log('beat entry has been written to database: \n', newBeat);
      // TODO: find out why this isnt deleting the files and not throwing an error
      fs.unlink(beat.path, () => {
        console.log('---  upload deleted from server  ---');
      });

      return res.status(200).json({ status: 'success', message: 'beat saved!' });
    } catch (err) {
      console.log('error caught in uploadBeatHandler function');
      console.error(err);
    }
  } else {
    console.log('no file detected');
  }
};

export const getAllBeatsHandler = async (req: Request, res: Response) => {
  try {
    const beats = await getAllBeats();
    res.status(200).json(beats);
  } catch (err) {
    console.error(err);
    return res.status(503).json({ status: 'fail', message: 'error occured getting beats from database' });
  }
};
