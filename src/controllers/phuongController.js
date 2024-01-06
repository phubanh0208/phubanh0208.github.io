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
    async adList(req, res) {
        try {
            let detailPopup='';
            let locationtable ='';
            let i =1;
            const userData = req.user;
            console.log(userData);
            const locationData = await Location.find();
            locationData.forEach(location => {
                if (location.ward == userData.ward && location.district == userData.district) {
                let index = '<td class="table-items">'+i+'</td>';
                let title = '<td class="table-items">' + location.type + '</td>';
                let descrip = '<td class="table-items">' + location.detail + '</td>';
                let address = '<td class="table-items">' + location.address+ '</td>';
                let type = '<td class="table-items">Đã huy hoạch</td>';          
                let adList = '';
                location.ads.forEach(ads => {
                    let title = '<li><strong>' + ads.type + '</strong></li>';
                    let address = '<li>' + location.address + ', Phường ' + location.ward + ', Quận ' + location.district + '</li>';
                    let size = '<li><strong>Kích thước: </strong>: ' + ads.size.x + 'm x ' + ads.size.y + 'm' + '</li>';
                    let count = '<li><strong>Số lượng: </strong> 1 trụ / bảng</li>';
                    let type = '<li><strong>Hình thức: </strong>' + location.type + '</li>';
                    let detail = '<li><strong>Phân loại: </strong>' + location.detail + '</li>';
                    let button1 = '<button class="popup-btn-left" onclick="handleLeftButtonClick()"><a href="home-guest/infor/'+ads._id+'">Thông tin</a></button>'
                    let button2 = '<button class="popup-btn-right" onclick="handleRightButtonClick()"><a href="home-guest/report/'+ads._id+'">Báo cáo sai phạm</a></button>'
                    adList += '<ul>' + title + address + size + count + type + detail + button1 + button2 + '</ul>';
                });
                let locationinfor = '<tr>'+index+title + descrip + address + type+
                '<td class="icon_detail"><a href="#" onclick="openDetail()"><i class="fa-solid fa-info-circle"></i></a></td>'+'</tr>';
    
                detailPopup += adList;
                locationtable+=locationinfor;
                i++;
                };
            });
            console.log(locationtable);
            //console.log(locationData);
          
            res.render('home_d_adList',{phuong:userData.ward,quan:userData.district,locationtableShow:locationtable});
    
        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Internal Server Error');
        }
    }

}
export default new phuongController();  
