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
  ]),
  uploadBeatHandler
);
router.post('/update/:id', verifyBeatOwner, updateBeatHandler);
router.post('/update-artist-name/:userId', verifyBeatOwner, updateArtistNameHandler);
router.delete('/:id', verifyBeatOwner, deleteBeatHandler);

export default router;
