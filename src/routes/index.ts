import { Router } from 'express';
import { indexHandler } from '../handlers';
import {
  uploadBeatHandler,
  getBeatsHandler,
  updateBeatHandler,
  deleteBeatHandler,
  updateArtistNameHandler,
} from '../handlers/index';
import multer from 'multer';
import path from 'path';
import { verifyBeatOwner } from '../middleware/verifyBeatOwner';
import { verifyUser } from '../middleware/verifyUser';

const router = Router();
const upload = multer({
  dest: path.join(__dirname, '../uploads'),
});

router.get('/', indexHandler);
router.get('/beats', getBeatsHandler);
router.post(
  '/upload',
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'artwork', maxCount: 1 },
  ]), verifyUser,
  uploadBeatHandler
);
router.post('/update/:id', verifyUser, verifyBeatOwner, updateBeatHandler);
router.delete('/:id', verifyUser, verifyBeatOwner, deleteBeatHandler);

// private routes called by other internal services only, will be replave by gRPC
router.post('/update-artist-name/:userId', updateArtistNameHandler);

export default router;
