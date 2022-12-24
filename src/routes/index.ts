import { Router } from 'express';
import { indexHandler } from '../handlers';
import { uploadBeatHandler, getAllBeatsHandler } from '../handlers/index';
import multer from 'multer';
import path from 'path';

const router = Router();
const upload = multer({
  dest: path.join(__dirname, '../uploads'),
});

router.get('/', indexHandler);

router.post(
  '/upload',
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'artwork', maxCount: 1 },
  ]),
  uploadBeatHandler
);

router.get('/beats', getAllBeatsHandler);

export default router;
