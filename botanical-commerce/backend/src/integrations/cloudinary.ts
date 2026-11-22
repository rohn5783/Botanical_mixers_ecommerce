import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env.js';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImageToCloudinary = async (
  filePathOrBuffer: string,
  folder: string = 'aranya_botanicals'
): Promise<{ url: string; publicId: string }> => {
  try {
    const result = await cloudinary.uploader.upload(filePathOrBuffer, {
      folder,
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' },
      ],
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error: any) {
    console.warn(`[Cloudinary] Upload simulated (${error.message}). Using local placeholder asset.`);
    return {
      url: '/images/products/placeholder-botanical.png',
      publicId: 'local-placeholder',
    };
  }
};

export { cloudinary };
