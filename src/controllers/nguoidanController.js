import Location from "../models/location.js";
import Advertisement from "../models/advertisement.js";
import Report from "../models/report.js"
import multer from 'multer';
import path from "path";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import ReportLocation from "../models/reportLocation.js";
import cookieParser from "cookie-parser";
import fs from 'fs';
import moment from "moment";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const parentDirectory = join(__dirname, '../public/images/report-images');
const inforDirectory = join(__dirname, '../public/images/infor');
console.log(parentDirectory);

// Cấu hình lưu trữ cho multer
let index = 0;
const storage = multer.memoryStorage();
const upload = multer();

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

            // Chuyển đổi buffer sang dữ liệu base64
            const imageBase64 = result.image.toString('base64');

            // Thêm đường dẫn URL của ảnh vào dữ liệu
            result.imageUrl = `data:image/png;base64,${imageBase64}`;

            res.render('inforAd', result);
        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Infor AD Error');
        }
    }
    async reportDetail(req, res) {
        try {

            let myArray = req.body.myData ?JSON.parse(req.body.myData):null;
            if (myArray == null){
                res.render('report-n-solve');
                return;
            } 
            console.log(myArray);
            //Tạo mảng các điều kiện tìm kiếm cho mỗi cặp tọa độ từ localStorage
            const searchConditions = myArray.map(coordinates => ({
                'coordinates.x': coordinates[1],
                'coordinates.y': coordinates[0],
            }));
            let locationData = await ReportLocation.find({ $or: searchConditions });


            let image = [];
            locationData.forEach(data => {
                let imageBase = data.Images[0] ? data.Images[0].toString('base64') : '';
                let imageUrl = `data:image/png;base64,${imageBase}`;
                let imageBase1 = data.Images[1] ? data.Images[1].toString('base64') : '';
                let imageUrl1 = `data:image/png;base64,${imageBase1}`;

                image.push([imageUrl, imageUrl1]);

            });
            const locationReports = locationData.map(locationData => locationData.toJSON());
            let index = 0;
            locationReports.forEach(data => {
                let formattedDate = moment(data.createdAt).format("DD [Tháng] MM YYYY");
                data.dateVN = formattedDate;
                data.Url1 = JSON.stringify(image[index][0]);
                data.Url2 = JSON.stringify(image[index][1]);
                index++;
            });



            let adData = await Report.find({ $or: searchConditions });
            await Report.find();
            image = [];
            adData.forEach(data => {
                let imageBase = data.Images[0] ? data.Images[0].toString('base64') : '';
                let imageUrl = `data:image/png;base64,${imageBase}`;
                let imageBase1 = data.Images[1] ? data.Images[1].toString('base64') : '';
                let imageUrl1 = `data:image/png;base64,${imageBase1}`;

                image.push([imageUrl, imageUrl1]);

            });
            const adReports = adData.map(adData => adData.toJSON());
            let index2 = 0;
            adReports.forEach(data => {
                let formattedDate = moment(data.createdAt).format("DD [Tháng] MM YYYY");
                data.dateVN = formattedDate;
                data.Url1 = JSON.stringify(image[index2][0]);
                data.Url2 = JSON.stringify(image[index2][1]);
                index2++;
            });




            // console.log(adData);
            res.render('report-n-solve', { locationReports, adReports });
        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Internal Server Error');
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

                const images = req.files || [];
                // Tìm điểm có id quảng cáo khớp với adId
                const point = await Location.findOne({ 'ads._id': req.params.id });
                // Lưu tọa độ vào cookies
                let coordinatesxy = [point.coordinates.y, point.coordinates.x];
                let newReport = new Report({
                    adId: req.params.id,
                    Name: req.body.inputName,
                    Email: req.body.inputEmail,
                    Number: req.body.inputNumber,
                    Type: req.body.inputReportType,
                    ward: point.ward,
                    district: point.district,
                    address: point.address,
                    Solution: '',
                    coordinates: {
                        x: point.coordinates.x,
                        y: point.coordinates.y,
                    },
                    Information: req.body.inputReportInformation,
                    Images: images.map(image => image.buffer),
                    status: 'Chưa xử lý' // Đặt trạng thái là 'Chưa xử lý' khi mới tạo báo cáo
                });


                console.log(newReport);
                await newReport.save();
                res.render('alert', { coordinatesxy });
            });
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).send('Unexpected error');
        }
    }
    async reportLocation(req, res) {
        try {
            let result = {
                address: req.query.address,
                ward: req.query.ward,
                district: req.query.district,
                latitude: req.query.latitude,
                longitude: req.query.longitude,
            }
            // Xử lý kết quả trả về
            // console.log('Found Documents:', result);
            res.render('report-location', result);
        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Infor AD Error');
        }
    }
    async postReportLocation(req, res) {
        try {
            // Sử dụng middleware upload.array như một phần của chuỗi xử lý yêu cầu
            // Sử dụng middleware upload.array như một phần của chuỗi xử lý yêu cầu
            upload.array('images', 2)(req, res, async (err) => {
                if (err) {
                    console.error('Error handling form data:', err);
                    res.status(500).send('Error handling form data');
                    return;
                }

                let formData = req.body;
                const images = req.files || [];

                let newReport = new ReportLocation({
                    Name: req.body.inputName,
                    Email: req.body.inputEmail,
                    Number: req.body.inputNumber,
                    Type: req.body.inputReportType,
                    Information: req.body.inputReportInformation,
                    address: req.query.address,
                    ward: req.query.ward,
                    district: req.query.district,
                    coordinates: {
                        x: req.query.longitude,
                        y: req.query.latitude,
                    },
                    Solution: '',
                    Images: images.map(image => image.buffer),// Thay uploadedImagePaths bằng đường dẫn thực tế của ảnh đã tải lên
                    status: 'Chưa xử lý' // Đặt trạng thái là 'Chưa xử lý' khi mới tạo báo cáo
                });
                // Tìm điểm có id quảng cáo khớp với adId
                // Lưu tọa độ vào cookies
                let coordinatesxy = [req.query.latitude, req.query.longitude];
                console.log(newReport);
                await newReport.save();
                res.render('alert', { coordinatesxy });
            });
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).send('Unexpected error');
        }
    }




}
// Hàm lấy giá trị của cookie theo tên

export default new nguoidanController();  
