import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../utils/jwt';
import { getBeat } from '../database/services/Beat.services';

/**
 * Middleware for ensuring a user can only edit / delete their own beats.
 */
export const verifyBeatOwner = async (req: Request, res: Response, next: NextFunction) => {
  const beatId = req.params.id;
  const user = req.user;
  if (!user) {
    return res.status(400).json({ message: 'No user info provided to middleware.' });
  }
  // get the beat from the database
  try {
    const beat = await getBeat(beatId);
    // handle no beat found
    if (!beat) {
      return res.status(404).json({ message: 'Beat not found' });
    }
    // handle malicious manipulation of someone elses data
    if (beat.artistId !== user.id) {
      console.log('beat.artistId !== userInfo.user.id');
      console.log('beat.artistId: ', beat.artistId);
      console.log('userInfo.user.id: ', user.id);
      console.log('beat: ', beat);
      return res.status(401).json({ message: 'You do not own this beat.' });
    }
    // the beat does belong to the user who made the request
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error occured when querying beat. ' });
  }
};
