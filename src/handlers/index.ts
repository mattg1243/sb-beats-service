import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import { uploadFileToS3 } from '../bucket/upload';
import {
  createBeat,
  getAllBeats,
  getAllBeatsByUser,
  updateBeat,
  beatRepository,
} from '../database/services/Beat.services';
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
  const user = req.user;
  if (!user) {
    console.log('Middleware failed to attach user.');
    return res.status(500).json('Middleware failed to attach user.');
  }

  if (req.files) {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const beat = files['audio'][0];
    const artwork = files['artwork'] ? files['artwork'][0] : null;

    try {
      // upload the files to the S3 bucket and save the Keys
      const beatUploadResponse = await uploadFileToS3(beat, res);
      if (!beatUploadResponse) {
        console.log('error uploading audio file to S3');
        return res.status(500).json('error uploading audio file to S3');
      }
      const audioKey = beatUploadResponse?.Key;
      console.log('Beat Upload Response: ', beatUploadResponse);

      let artworkKey: string | undefined = undefined;
      if (artwork) {
        const artworkUploadResponse = await uploadFileToS3(artwork);
        if (!artworkUploadResponse) {
          return res.status(500).json('error uploading artwork file to S3');
        }
        artworkKey = artworkUploadResponse?.Key;
      }
      // now need to create an SQL row and store the filepath there
      console.timeEnd(uploadTimer);
      console.log('file(s) uploaded: ');
      // get the necessary user info
      // save the beat data to the sql table
      const newBeat = await createBeat({
        title: title,
        description: description,
        artistId: user.id,
        artistName: user.artistName,
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
// TODO: refactor this to make it more dry
export const getBeatsHandler = async (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  if (!userId) {
    try {
      const beats = await getAllBeats();
      return res.status(200).json(beats);
    } catch (err) {
      console.error(err);
      return res.status(503).json({ status: 'fail', message: 'error occured getting beats from database' });
    }
  } else {
    try {
      const beats = await getAllBeatsByUser(userId);
      return res.status(200).json(beats);
    } catch (err) {
      console.error(err);
      return res.status(503).json({ status: 'fail', message: 'error occured getting beats from database' });
    }
  }
};

export const updateBeatHandler = async (req: Request, res: Response) => {
  // TODO: implement updating artwork
  const beat = req.body;
  console.log('beat: ', beat);
  try {
    const upatedBeat = await updateBeat(beat._id, beat);
    return res.status(200).json({ message: 'Beat successfully updated.' });
  } catch (err) {
    return res.status(500).json({ message: 'There was an error updating your beat.' });
  }
};

export const updateArtistNameHandler = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const artistName = req.body.artistName;
  try {
    const updatedBeatsResponse = await beatRepository.update({ artistId: userId }, { artistName: artistName });
    console.log('beats update:\n', updatedBeatsResponse);
    return res.status(200).json({ message: 'Artist name update successfully in the beats table.' });
  } catch (err) {
    console.error(err);
    return res.status(503).json({ message: 'There was a problem updating your artist name for your beats.' });
  }
};

export const deleteBeatHandler = async (req: Request, res: Response) => {
  // THIS NEEDS TO DELETE THE BEAT FROM THE S3 BUCKET ALSO
  const beatId = req.params.id;
  try {
    const deleteBeatResponse = await beatRepository.delete({ _id: beatId });
    console.log(deleteBeatResponse);
    return res.status(200).json({ message: 'Beat deleted successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(503).json({ message: 'Error deleting beat.' });
  }
};
