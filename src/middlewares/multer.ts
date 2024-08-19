/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/config';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'campus_coloc_users',
    allowedFormats: ['jpg', 'png', 'jpeg', 'pdf'],
    public_id: (req: Request, file: { originalname: any; }) => `${Date.now()}`,
  },
} as any);

export const upload = multer({ storage });