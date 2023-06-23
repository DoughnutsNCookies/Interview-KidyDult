import { MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export const interceptorConfig: MulterModuleOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  }),
};
