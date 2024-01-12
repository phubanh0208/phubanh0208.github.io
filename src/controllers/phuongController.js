import Location from "../models/location.js";
import Advertisement from "../models/advertisement.js";
import adEdit from "../models/adEdit.js";
import locationEdit from "../models/locationEdit.js";
import Report from "../models/report.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import moment from "moment";
import ReportLocation from "../models/reportLocation.js";
import RequestAd from "../models/requestAd.js";
import sendEmail from "../helper/sendEmail.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cấu hình lưu trữ cho multer
let index = 0;
const storage = multer.memoryStorage();
const upload = multer();

class phuongController {
    // [GET] /work
    async home(req, res) {
        try {
            const locationData = JSON.stringify(await Location.find());
            //console.log(locationData);
            // console.log(req.user)
            let adRP = await Report.find({
                $and: [
                    { ward: req.user.ward },
                    { district: req.user.district }
                    // Bạn có thể thêm các điều kiện khác vào đây nếu cần
                ]
            });
            let LocationRP = await ReportLocation.find({
                $and: [
                    { ward: req.user.ward },
                    { district: req.user.district }
                    // Bạn có thể thêm các điều kiện khác vào đây nếu cần
                ]
            });
            console.log(LocationRP);

            const locationReports = LocationRP.map(LocationRP => LocationRP.toJSON());
            const adReports = adRP.map(adRP => adRP.toJSON());

            res.render('home_d', { locationData, locationReports, adReports });

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

            res.render('inforAd-d', result);
        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Infor AD Error');
        }
    }
    async adList(req, res) {
        try {
            let detailPopup = '';
            let locationtable = '';
            let i = 1;
            const userData = req.user;
            console.log(userData);
            const locationData = await Location.find({
                $and: [
                    { ward: req.user.ward },
                    { district: req.user.district }
                    // Bạn có thể thêm các điều kiện khác vào đây nếu cần
                ]
            });
            locationData.forEach(location => {
                if (1 == 1) {
                    let index = '<td class="table-items">' + i + '</td>';
                    let title = '<td class="table-items">' + location.type + '</td>';
                    let descrip = '<td class="table-items">' + location.detail + '</td>';
                    let address = '<td class="table-items">' + location.address + ', Phường ' + location.ward + ', Quận ' + location.district + '</td>';
                    let type = '<td class="table-items">Đã huy hoạch</td>';
                    if (location.condition == 0) type = '<td class="table-items">Chưa huy hoạch</td>';
                    let adList = '';
                    location.ads.forEach(ads => {
                        let title = '<li><strong>' + ads.type + '</strong></li>';
                        let address = '<li>' + ads.address + ', Phường ' + location.ward + ', Quận ' + location.district + '</li>';
                        let size = '<li><strong>Kích thước: </strong>: ' + ads.size.x + 'm x ' + ads.size.y + 'm' + '</li>';
                        let count = '<li><strong>Số lượng: </strong> 1 trụ / bảng</li>';
                        let type = '<li><strong>Hình thức: </strong>' + location.type + '</li>';
                        let detail = '<li><strong>Phân loại: </strong>' + location.detail + '</li>';
                        let button1 = '<button class="popup-btn-right" onclick="handleRightButtonClick()"><a href="/home_wardUser/infor/' + ads._id + '">Thông tin</a></button>'
                        let button2 = '<button class="popup-btn-right" onclick="handleRightButtonClick()"><a href="request-edit/' + ads._id + '">Yêu cầu chỉnh sửa</a></button>'
                        adList += '<ul>' + title + address + size + count + type + detail + button1 + button2 + '</ul>';
                    });
                    let locationinfor = '<tr>' + index + title + descrip + address + type +
                        '<td class="icon_detail"><button href="#" onclick="openDetail' + i + '()"><i class="fa-solid fa-info-circle"></i></button></td>' + '</tr>';

                    detailPopup += '<div id="manage-detail_popup"  class="popup' + i + '"' + '>' + adList + `<img class="details_image" src="../images/image_ads.png" alt="">
                <div class="remove_button">
                  <button class="btn btn-danger btn-sm" onclick="window.location.href='request-editLocation/`+ location._id + `'">Sửa thông tin điểm đặt</button>
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
    async reportList(req, res) {
        try {

            let adData = await Report.find({
                $and: [
                    { ward: req.user.ward },
                    { district: req.user.district }
                    // Bạn có thể thêm các điều kiện khác vào đây nếu cần
                ]
            });
            let locationData = await ReportLocation.find({
                $and: [
                    { ward: req.user.ward },
                    { district: req.user.district }
                    // Bạn có thể thêm các điều kiện khác vào đây nếu cần
                ]
            });
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



            const userData = req.user;
            // console.log(adData);
            res.render('report-list', { locationReports, adReports, wardid: req.user.ward, districtid: req.user.district });
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
                console.log(uploadedImages);

                const inputName = req.body.inputName;
                const inputType = req.body.inputType;
                const inputSize = req.body.inputSize;
                const inputDuration = req.body.inputDuration;
                const inputReportInformation = req.body.inputReportInformation;

                const [x, y] = inputSize.split(',');
                let newReport = new adEdit({
                    adId: req.params.id,
                    name: inputName,
                    type: inputType,
                    size: {
                        x: parseInt(x),
                        y: parseInt(y),
                    },
                    duration: parseInt(inputDuration),
                    reportInformation: inputReportInformation,
                    Images: uploadedImages.map(image => image.buffer),
                    status: 'Chưa xử lý' // Đặt trạng thái là 'Chưa xử lý' khi mới tạo báo cáo
                });
                console.log(newReport);
                await newReport.save();
                res.render('alert2');
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
    async postEditLocation(req, res) {
        try {
            const inputType = req.body.inputType;
            const inputDetail = req.body.inputDetail;
            const inputCondition = req.body.inputCondition;
            const inputAddress = req.body.inputAddress;
            const inputLocationInfomation = req.body.inputLocationInfomation;

            // Log form data (you can save it to a database or perform any other action)
            console.log('Form Data:');
            console.log('Loại quảng cáo:', inputType);
            console.log('Loại đất:', inputDetail);
            console.log('Cập nhật huy hoạch:', inputCondition);
            console.log('Địa chỉ:', inputAddress);
            console.log('Lý do:', inputLocationInfomation);
            let newReport = new locationEdit({
                locationId: req.params.id,
                address: inputAddress,
                detail: inputDetail,
                type: inputType,
                condition: inputCondition,
                Information: inputLocationInfomation,
                status: 'Chưa xử lý' // Đặt trạng thái là 'Chưa xử lý' khi mới tạo báo cáo
            });
            console.log(newReport);
            await newReport.save();
            res.render('alert');
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).send('Unexpected error');
        }
    }

    async requestAd(req, res) {
        try {
            let LocationData = await Location.find({
                $and: [
                    { ward: req.user.ward },
                    { district: req.user.district }
                    // Bạn có thể thêm các điều kiện khác vào đây nếu cần
                ]
            });
            console.log(LocationData);
            const locationReports = LocationData.map(LocationData => LocationData.toJSON());

            res.render('request-lisencing', { locationReports });

        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async postRequestAd(req, res) {
        try {
            // Sử dụng middleware upload.array như một phần của chuỗi xử lý yêu cầu
            upload.array('images', 2)(req, res, async (err) => {
                if (err) {
                    console.error('Error handling form data:', err);
                    res.status(500).send('Error handling form data');
                    return;
                }
                const formData = req.body;
                const images = req.files || [];
                let LocationData = await Location.findById(formData.location);
                // Chuyển đổi chuỗi ngày thành đối tượng Date
                const startDate = new Date(formData.dateStar);
                const endDate = new Date(formData.dayend);

                // Tính khoảng cách giữa hai ngày
                const timeDifference = endDate.getTime() - startDate.getTime();

                // Chuyển đổi khoảng cách từ milliseconds sang số ngày
                const daysDifference = timeDifference / (1000 * 3600 * 24);
                let newReport = new RequestAd({
                    ward: LocationData.ward,
                    district: LocationData.district,
                    location: formData.location,
                    name: formData.NameAd,
                    type: formData.type,
                    size: {
                        x: formData.X,
                        y: formData.Y,
                    },
                    owner: formData.inputName,
                    ownerInfor: formData.inputNameInfor,
                    ownerEmail: formData.inputEmail,
                    ownerPhone: formData.inputNumber,
                    inforAd: formData.inputReportInformation,

                    date: formData.dateStar,
                    form: LocationData.type,      // Trường hình thức
                    category: LocationData.detail,
                    duration: daysDifference,
                    address: formData.address,
                    Images: images.map(image => image.buffer),
                    status: 'Chưa xử lý' // Đặt trạng thái là 'Chưa xử lý' khi mới tạo báo cáo
                });
                await newReport.save();
                //res.render('alert2');
                res.render('alert2');
                // Perform further processing or save data to a database here

            });
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).send('Unexpected error');
        }
    }

    async requestList(req, res) {
        try {

            let requestData = await RequestAd.find({
                $and: [
                    { ward: req.user.ward },
                    { district: req.user.district }
                    // Bạn có thể thêm các điều kiện khác vào đây nếu cần
                ]
            });

            let image = [];
            requestData.forEach(data => {
                let imageBase = data.Images[0] ? data.Images[0].toString('base64') : '';
                let imageUrl = `data:image/png;base64,${imageBase}`;
                let imageBase1 = data.Images[1] ? data.Images[1].toString('base64') : '';
                let imageUrl1 = `data:image/png;base64,${imageBase1}`;
                image.push([imageUrl, imageUrl1]);

            });
            const request = requestData.map(requestData => requestData.toJSON());
            let index = 0;
            request.forEach(data => {
                let formattedDate = moment(data.date).format("DD [Tháng] MM YYYY");
                data.dateVN = formattedDate;
                data.Url1 = JSON.stringify(image[index][0]);
                data.Url2 = JSON.stringify(image[index][1]);
                index++;
            });

            const userData = req.user;
            //console.log(request);
            res.render('request-list', { request, wardid: req.user.ward, districtid: req.user.district });
        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Internal Server Error');
        }
    }
    //api
    async updateStatus(req, res) {
        try {
            const { reportId, newStatus, inputValue } = req.body;
            const generateHtmlEmail = (newStatus, inputValue,infor) => {
                return `
                  <html>
                    <head>
                      <style>
                        body {
                          font-family: 'Arial', sans-serif;
                          background-color: #f4f4f4;
                          color: #333;
                          margin: 0;
                          padding: 0;
                        }
              
                        .container {
                          width: 80%;
                          max-width: 600px;
                          margin: 0 auto;
                          padding: 20px;
                          background-color: #fff;
                          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                          border-radius: 5px;
                        }
              
                        h1 {
                          color: #001d57;
                        }
              
                        p {
                          margin-bottom: 15px;
                        }
              
                        strong {
                          color: #001d57;
                        }
              
                        .footer {
                          margin-top: 20px;
                          font-size: 12px;
                          color: #777;
                        }
                      </style>
                    </head>
                    <body>
                      <div class="container">
                        <h1>Thông báo cập nhật từ Cán bộ phường quận</h1>
                        <p>Cán bộ phường quận đã cập nhật thông tin về báo cáo của bạn:</p>
                        <p><strong>Địa chỉ báo cáo:</strong> ${infor}</p>
                        <p><strong>Tình trạng xử lý:</strong> ${newStatus}</p>
                        <p><strong>Cách thức xử lý:</strong> ${inputValue}</p>
                        <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!</p>
                        <div class="footer">
                          <p>Đây là email tự động, vui lòng không trả lời.</p>
                        </div>
                      </div>
                    </body>
                  </html>
                `;
              };
            // Thực hiện cập nhật giá trị trong MongoDB
            const reportLocation = await ReportLocation.findById(reportId);

            if (reportLocation) {
                // Nếu tài liệu ReportLocation tồn tại, thực hiện cập nhật
                const MailSend = await ReportLocation.findByIdAndUpdate(reportId, { status: newStatus, Solution: inputValue });
                let title = MailSend.address+' Phường '+MailSend.ward+ ' Quận '+MailSend.district
                const htmlContent = generateHtmlEmail(newStatus, inputValue,title);
                sendEmail(MailSend.Email,'Cách thức xử lý và cập nhật tình trạng xử lý',htmlContent)
            } else {
                const MailSend = await Report.findByIdAndUpdate(reportId, { status: newStatus, Solution: inputValue });
                let title = MailSend.address+' Phường '+MailSend.ward+ ' Quận '+MailSend.district
                const htmlContent = generateHtmlEmail(newStatus, inputValue,title);
                sendEmail(MailSend.Email,'Cách thức xử lý và cập nhật tình trạng xử lý',htmlContent)
            }
            res.json({ success: true, message: 'Cập nhật thành công' });
        } catch (error) {
            console.error('Lỗi cập nhật status:', error);
            res.status(500).json({ success: false, message: 'Lỗi cập nhật status' });
        }
    };

    async updateRequest(req, res) {
        try {
            const requestId = req.body.reportId;
            console.log(requestId);
            // Thực hiện cập nhật giá trị trong MongoDB
            RequestAd.deleteOne({ _id: requestId });
            const result = await RequestAd.deleteOne({ _id: requestId });
            if (result.deletedCount > 0) {
                res.json({ success: true, message: 'Đã cập nhật' });
            } else {
                res.json({ success: false, message: 'Không tìm thấy bản ghi để xóa' });
            }
        } catch (error) {
            console.error('Lỗi cập nhật status:', error);
            res.status(500).json({ success: false, message: 'Lỗi cập nhật status' });
        }
    };

}
export default new phuongController();  
