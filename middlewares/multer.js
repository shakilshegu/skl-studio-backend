import multer from 'multer';
import path from 'path';

// Configure Multer to store files locally
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const suffix = Date.now() + '-' + `${Math.random()}`.substring(2);
    const name = path.parse(file.originalname).name;
    return cb(null, suffix + '-' + name + '.webp');
  },
});

// Create the Multer instance with the storage configuration
const upload = multer({ storage: storage });

export default upload;
