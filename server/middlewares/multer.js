import multer from 'multer';

// Use memory storage to handle files as buffers
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB file size limit
});

export const uploadSingleImage = upload.single('image');
export const uploadMultipleImages = upload.array('images', 10); // 'images' is the field name, 10 is max count