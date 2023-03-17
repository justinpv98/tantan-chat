import config from '@/config/config';
import { AdminApiOptions, UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import Multer from 'multer';


const upload = Multer({
  dest: 'uploads/',
  limits: {
      fileSize: 2 * 1024 * 1024 // no larger than 2mb
  }
});

cloudinary.config(config.cloudinary);

function uploadImage(file: any, folder: string){
    if (file) {
        return new Promise(async (resolve, reject) => {
          const adminApiOptions = {
            folder,
            resource_type: "auto",
            overwrite: true,
            quality: "auto",
            format: "webp"
          } as any;
    
          if (Array.isArray(file)) {
            const req = file.map((image: any) => {
              return cloudinary.uploader.upload(image.path, adminApiOptions);
            });
    
            try {
              const result = await Promise.all(req);
              resolve(result);
            } catch (err) {
              reject(err);
            }
          } else {

            try {
              const result = await cloudinary.uploader.upload(
                file.path, adminApiOptions
              );

              resolve(result);
            } catch (err) {
              reject(err);
            }
          }
        });
      }
}


export {upload, uploadImage};
