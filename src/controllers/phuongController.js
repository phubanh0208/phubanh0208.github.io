import Location from "../models/location.js";
import Advertisement from "../models/advertisement.js";
import adEdit from "../models/adEdit.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import moment from "moment";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const parentDirectory = join(__dirname, '../public/images/request-edit');
console.log(parentDirectory);

// Cấu hình lưu trữ cho multer
let index = 0;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, parentDirectory); // Thư mục lưu trữ ảnh
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Math.round(Math.random() * 1E9);
        const extname = path.extname(file.originalname);
        cb(null, 'image-' + uniqueSuffix + extname);
    }
});

const upload = multer({ storage: storage });

class phuongController {
    // [GET] /work
    async home(req, res) {
        try {
            const locationData = JSON.stringify(await Location.find());
            //console.log(locationData);
            res.render('home_d', { locationData });

        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Internal Server Error');
        }
    }
    async adList(req, res) {
        try {
            let detailPopup = '';
            let locationtable = '';
            let i = 1;
            const userData = req.user;
            console.log(userData);
            const locationData = await Location.find();
            locationData.forEach(location => {
                if (1 == 1) {
                    let index = '<td class="table-items">' + i + '</td>';
                    let title = '<td class="table-items">' + location.type + '</td>';
                    let descrip = '<td class="table-items">' + location.detail + '</td>';
                    let address = '<td class="table-items">' + location.address + ', Phường ' + location.ward + ', Quận ' + location.district + '</td>';
                    let type = '<td class="table-items">Đã huy hoạch</td>';
                    if (location.condition == 0 ) type='<td class="table-items">Chưa huy hoạch</td>';
                    let adList = '';
                    location.ads.forEach(ads => {
                        let title = '<li><strong>' + ads.type + '</strong></li>';
                        let address = '<li>' + location.address + ', Phường ' + location.ward + ', Quận ' + location.district + '</li>';
                        let size = '<li><strong>Kích thước: </strong>: ' + ads.size.x + 'm x ' + ads.size.y + 'm' + '</li>';
                        let count = '<li><strong>Số lượng: </strong> 1 trụ / bảng</li>';
                        let type = '<li><strong>Hình thức: </strong>' + location.type + '</li>';
                        let detail = '<li><strong>Phân loại: </strong>' + location.detail + '</li>';
                        let button2 = '<button class="popup-btn-right" onclick="handleRightButtonClick()"><a href="request-edit/' + ads._id + '">Yêu cầu chỉnh sửa</a></button>'
                        adList += '<ul>' + title + address + size + count + type + detail + button2 + '</ul>';
                    });
                    let locationinfor = '<tr>' + index + title + descrip + address + type +
                        '<td class="icon_detail"><button href="#" onclick="openDetail' + i + '()"><i class="fa-solid fa-info-circle"></i></button></td>' + '</tr>';

                    detailPopup += '<div id="manage-detail_popup"  class="popup' + i + '"' + '>' + adList + `<img class="details_image" src="../images/image_ads.png" alt="">
                <div class="remove_button">
                  <button class="btn btn-danger btn-sm" onclick="window.location.href='request-editLocation/`+location._id+`'">Sửa thông tin điểm đặt</button>
                </div>
             
                
                </div>
              <!-- Remove button at the bottom -->`
                    locationtable += locationinfor;
                    i++;
                };
            });
            console.log(locationtable);
            //console.log(locationData);

            res.render('home_d_adList', { phuong: userData.ward, quan: userData.district, locationtableShow: locationtable, detailLocation: detailPopup, i: i });

        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Internal Server Error');
        }
    }
    async requestEdit(req, res) {
        try {
            let userId = req.params.id;
            let result = await Advertisement.findById(userId);
            // Xử lý kết quả trả về
            // console.log('Found Documents:', result);
            const formattedDate = moment(result.date).format("DD [Tháng] MM YYYY");
            result.dateVN = formattedDate;
            res.render('request-Edit', result);

        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Internal Server Error');
        }
    }
    async postEditAd(req, res) {
        try {
            // Sử dụng middleware upload.array như một phần của chuỗi xử lý yêu cầu
            upload.array('images', 2)(req, res, async (err) => {
                if (err) {
                    console.error('Error handling form data:', err);
                    res.status(500).send('Error handling form data');
                    return;
                }

                let formData = req.body;
                let uploadedImages = req.files || [];

                // Xử lý dữ liệu tùy theo nhu cầu của bạn
                console.log('Received form data:', formData);
                let listImage = [];
                // Xử lý danh sách các file ảnh được tải lên
                uploadedImages.forEach(image => {
                    console.log('Uploaded Image:', image.filename);
                    listImage.push(image.filename);
                    // Lưu thông tin ảnh vào database hoặc làm các xử lý khác tùy thuộc vào yêu cầu của bạn
                });
                const inputName = req.body.inputName;
                const inputType = req.body.inputType;
                const inputSize = req.body.inputSize;
                const inputDuration = req.body.inputDuration;
                const inputReportInformation = req.body.inputReportInformation;
            
                const [x, y] = inputSize.split(',');
                let newReport = new adEdit({
                    name: inputName,
                    type: inputType,
                    size: {
                        x: parseInt(x),
                        y: parseInt(y),
                    },
                    duration: parseInt(inputDuration),
                    reportInformation: inputReportInformation,
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

    async requestEditLocation(req, res) {
        try {
            let userId = req.params.id;
            let result = await Location.findById(userId);
            res.render('request-Edit-Location', result);

        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Internal Server Error');
        }
    }



}
export default new phuongController();  
