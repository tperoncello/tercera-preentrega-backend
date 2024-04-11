import multer from 'multer'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'documents';
        
        if (file.fieldname === 'profileImage') {
            folder = 'profiles';
        } else if (file.fieldname === 'productImage') {
            folder = 'products';
        }

        cb(null, `uploads/${folder}`);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.originalname + '-' + uniqueSuffix);
    },
});


export const upload = multer({ storage: storage });


