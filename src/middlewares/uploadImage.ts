import multer from "multer";
import multerS3 from "multer-s3";
import { S3Client } from "@aws-sdk/client-s3";
import { FileFilterCallback } from "multer";
import path from "path";

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.AWS_PUBLIC_ACCESS_KEY || "",
        secretAccessKey: process.env.AWS_SECRET_KEY || "",
    },
    region: process.env.AWS_REGION,
});

const s3Storage = multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME || "",
    metadata: (req, file, cb) => {
        cb(null, { fieldname: file.fieldname });
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
        const fileName =
            Date.now() + "_" + file.fieldname + "_" + file.originalname;
        cb(null, fileName);
    },
});

// function to sanitize files and send error for unsupported files
type MulterFile = {
    fieldname: string;
    originalname: string;
    mimetype: string;
};

function sanitizeFile(file: MulterFile, cb: FileFilterCallback): void {
    // Define the allowed extension
    const fileExts = [".png", ".jpg", ".jpeg", ".gif"];

    // Check allowed extensions
    const isAllowedExt = fileExts.includes(
        path.extname(file.originalname.toLowerCase())
    );

    // Mime type must be an image
    const isAllowedMimeType = file.mimetype.startsWith("image/");

    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true); // no errors
    } else {
        // pass error msg to callback, which can be displayed in frontend
        cb(new Error("Error: File type not allowed!"));
    }
}

const uploadImage = multer({
    storage: s3Storage,
    fileFilter: (req, file, callback) => {
        sanitizeFile(file, callback);
    },
    // limits: {
    //     fileSize: 1024 * 1024 * 2, // 2mb file size
    // },
});

export default uploadImage;
