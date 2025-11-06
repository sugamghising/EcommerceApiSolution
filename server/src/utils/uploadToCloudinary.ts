import cloudinary from './cloudinary';
import { Readable } from 'stream';

interface UploadResult {
    secure_url: string;
    public_id: string;
}

export const uploadImageToCloudinary = async (
    fileBuffer: Buffer,
    folder: string = 'products'
): Promise<UploadResult> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'image',
                transformation: [
                    { width: 800, height: 800, crop: 'limit' }, // Resize large images
                    { quality: 'auto' }, // Auto optimize quality
                    { fetch_format: 'auto' }, // Auto format (WebP if supported)
                ],
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else if (result) {
                    resolve({
                        secure_url: result.secure_url,
                        public_id: result.public_id,
                    });
                } else {
                    reject(new Error('Upload failed'));
                }
            }
        );

        // Convert buffer to stream and pipe to Cloudinary
        const readableStream = Readable.from(fileBuffer);
        readableStream.pipe(uploadStream);
    });
};

// Helper to delete image from Cloudinary
export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
    }
};