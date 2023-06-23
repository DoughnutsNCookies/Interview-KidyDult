import { MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export const interceptorConfig: MulterModuleOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      callback(null, file.originalname);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (file.originalname.endsWith('.txt')) {
      callback(null, true);
    } else {
      callback(
        new Error(
          'Invalid file extension - .txt files only: ' + file.originalname,
        ),
        false,
      );
    }
  },
  limits: {
    fileSize: 1000001,
  },
};
