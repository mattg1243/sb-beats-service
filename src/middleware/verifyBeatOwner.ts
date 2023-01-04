import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';
import { getBeat } from '../database/services/Beat.services';

export const verifyBeatOwner = async (req: Request, res: Response, next: NextFunction) => {
  const beatId = req.params.id;
  const token = req.cookies['sb-access-token'];
  const userInfo = verifyJwt(token);
  if (!token || !userInfo) {
    return res.status(400).json({ message: 'No token provided / error verifying token' });
  }
  // get the beat from the database
  try {
    const beat = await getBeat(beatId);
    // handle no beat found
    if (!beat) {
      return res.status(404).json({ message: 'Beat not found' });
    }
    // handle malicious manipulation of someone elses data
    if (beat.artistID !== userInfo.user.id) {
      return res.status(401).json({ message: 'You do not own this beat.' });
    }
    // the beat does belong to the user who made the request
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error occured when querying beat. ' });
  }
};
