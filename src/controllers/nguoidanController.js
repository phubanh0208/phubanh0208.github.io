import Location from "../models/location.js";
import Advertisement from "../models/advertisement.js";
import Report from "../models/report.js"
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname,join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const parentDirectory = join(__dirname, '../public/images/report-images');
console.log(parentDirectory);

// Cấu hình lưu trữ cho multer
let index=0;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, parentDirectory); // Thư mục lưu trữ ảnh
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Math.round(Math.random() * 1E9);
        const extname = path.extname(file.originalname);
        cb(null, 'image-' +uniqueSuffix+ extname);
    }
});

const upload = multer({ storage: storage });

class nguoidanController {
    // [GET] /work
    async home(req, res) {
        try {
            const locationData = JSON.stringify(await Location.find());
            //console.log(locationData);
            res.render('home_g', { locationData });
        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Internal Server Error');
        }
    }
    async inforAd(req, res) {
        try {
            const userId = req.params.id;
            const result = await Advertisement.findById(userId);
            // Xử lý kết quả trả về
            //console.log('Found Documents:', result);
            res.render('inforAd', result);
        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Infor AD Error');
        }
    }
    async reportAd(req, res) {
        try {
            const userId = req.params.id;
            const result = await Advertisement.findById(userId);
            // Xử lý kết quả trả về
            // console.log('Found Documents:', result);
            res.render('report', result);
        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Infor AD Error');
        }
    }
    async postReportAd(req, res) {
        try {
            // Sử dụng middleware upload.array như một phần của chuỗi xử lý yêu cầu
            upload.array('images', 2)(req, res, async (err) => {
                if (err) {
                    console.error('Error handling form data:', err);
                    res.status(500).send('Error handling form data');
                    return;
                }

                const formData = req.body;
                const uploadedImages = req.files || [];

                // Xử lý dữ liệu tùy theo nhu cầu của bạn
                console.log('Received form data:', formData);
                let listImage=[];
                // Xử lý danh sách các file ảnh được tải lên
                uploadedImages.forEach(image => {
                    console.log('Uploaded Image:', image.filename);
                    listImage.push(image.filename);
                    // Lưu thông tin ảnh vào database hoặc làm các xử lý khác tùy thuộc vào yêu cầu của bạn
                });
                let newReport = new Report({
                    adId: req.params.id,
                    Name: req.body.inputName,
                    Email: req.body.inputEmail,
                    Number: req.body.inputNumber,
                    Type: req.body.inputReportType,
                    Information: req.body.inputReportInformation,
                    Images: listImage, // Thay uploadedImagePaths bằng đường dẫn thực tế của ảnh đã tải lên
                    status: 'Chưa xử lý' // Đặt trạng thái là 'Chưa xử lý' khi mới tạo báo cáo
                });
                console.log(newReport);
                await newReport.save();
                res.render('alert');
            });
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).send('Unexpected error');
        }
    }

}
export default new nguoidanController();  
