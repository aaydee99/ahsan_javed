import { Router } from 'express';
import { addProperty, getProperties } from '../controllers/property.controller';
import multer from 'multer';

const upload = multer(); // Configure multer for handling file uploads
const router = Router();

router.post('/addproperty', upload.single('Image'), addProperty);
router.get('/', getProperties);

export default router;
