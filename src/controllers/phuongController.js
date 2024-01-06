import Location from "../models/location.js";
import Advertisement from "../models/advertisement.js";
import Report from "../models/report.js"
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname,join } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// const parentDirectory = join(__dirname, '../public/images/report-images');
// console.log(parentDirectory);

// // Cấu hình lưu trữ cho multer
// let index=0;
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, parentDirectory); // Thư mục lưu trữ ảnh
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Math.round(Math.random() * 1E9);
//         const extname = path.extname(file.originalname);
//         cb(null, 'image-' +uniqueSuffix+ extname);
//     }
// });

// const upload = multer({ storage: storage });

class phuongController {
    // [GET] /work
    async home(req, res) {
        try {
            // const locationData = JSON.stringify(await Location.find());
            // //console.log(locationData);
            // res.render('home_g', { locationData });\
            res.render('home_d')
        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Internal Server Error');
        }
    }

}
export default new phuongController();  
