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

class soController {
    // [GET] /work
    async home(req, res) {
        try {
            const locationData = JSON.stringify(await Location.find());
            //console.log(locationData);
            // console.log(req.user)
            let adRP = await Report.find();
            let LocationRP = await ReportLocation.find();
         
            const locationReports = LocationRP.map(LocationRP => LocationRP.toJSON());
            const adReports = adRP.map(adRP => adRP.toJSON());

            res.render('so/home_dp', { locationData, locationReports, adReports });

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
            const locationData = await Location.find();
            locationData.forEach(location => {
                if (1 == 1) {
                    let index = '<td class="table-items">' + i + '</td>';
                    let title = '<td class="table-items">' + location.type + '</td>';
                    let descrip = '<td class="table-items">' + location.detail + '</td>';
                    let address = '<td class="table-items">' + location.address + ', Phường ' + location.ward + ', Quận ' + location.district + '</td>';
                    let type = '<td class="table-items">Đã huy hoạch</td>';
                    let button = `<td class="table-items"><button class="btn btn-danger show-details-btn"
                    data-idLocation="`+ location._id + `">
                    Xóa
                  </button></td>`;
                    if (location.condition == 0) type = '<td class="table-items">Chưa huy hoạch</td>';
                    let adList = '';
                    location.ads.forEach(ads => {
                        let title = '<li><strong>' + ads.type + '</strong></li>';
                        let address = '<li>' + ads.address + ', Phường ' + location.ward + ', Quận ' + location.district + '</li>';
                        let size = '<li><strong>Kích thước: </strong>: ' + ads.size.x + 'm x ' + ads.size.y + 'm' + '</li>';
                        let count = '<li><strong>Số lượng: </strong> 1 trụ / bảng</li>';
                        let type = '<li><strong>Hình thức: </strong>' + location.type + '</li>';
                        let detail = '<li><strong>Phân loại: </strong>' + location.detail + '</li>';
                        let button1 = '<button class="popup-btn-right" onclick="handleRightButtonClick()"><a href="/admin/infor/' + ads._id + '">Thông tin</a></button>'
                        let button2 = '<button class="popup-btn-right" onclick="handleRightButtonClick()"><a href="admin-edit/' + ads._id + '">Chỉnh sửa</a></button>'
                        let button3 = '<button class="popup-btn-right clickon" data-idads=' + ads._id + '><a href="#">Xóa</a></button>'

                        adList += '<ul>' + title + address + size + count + type + detail + button1 + button2 + button3 + '</ul>';
                    });
                    let locationinfor = '<tr>' + index + title + descrip + address + type + button +
                        '<td class="table-items icon_detail"><button href="#" onclick="openDetail' + i + '()"><i class="fa-solid fa-info-circle"></i></button></td>' + '</tr>';

                    detailPopup += '<div id="manage-detail_popup"  class="popup' + i + '"' + '>' + adList + `<img class="details_image" src="../images/image_ads.png" alt="">
                <div class="remove_button">
                <button class="btn btn-success btn-sm" onclick="window.location.href='add-ads/`+ location._id + `'">Thêm quảng cáo</button>

                  <button class="btn btn-danger btn-sm" onclick="window.location.href='request-editLocation/`+ location._id + `'">Sửa thông tin điểm đặt</button>
                </div>
             
                
                </div>
              <!-- Remove button at the bottom -->`
                    locationtable += locationinfor;
                    i++;
                };
            });
            //console.log(locationData);

            res.render('so/home_dp_adList', { locationtableShow: locationtable, detailLocation: detailPopup, i: i });

        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Internal Server Error');
        }
    }
    async reportList(req, res) {
        try {

            let adData = await Report.find();
            let locationData = await ReportLocation.find();
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
            res.render('so/report-list', { locationReports, adReports, wardid: req.user.ward, districtid: req.user.district });
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
            res.render('so/request-Edit', result);

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

                let adID = req.params.id;
                let images = req.files || [];

                const inputName = req.body.inputName;
                const inputType = req.body.inputType;
                const inputSize = req.body.inputSize;
                const inputDuration = req.body.inputDuration;
                const inputAddress = req.body.inputAddress;
                const Images = images.map(image => image.buffer);
                const [x, y] = inputSize.split(',');
                const xy = { x, y };
                const updatedAdInfo = { name: inputName, type: inputType, size: xy, address: inputAddress, duration: inputDuration };
                const editad = await Advertisement.findByIdAndUpdate(adID, { name: inputName, type: inputType, size: xy, address: inputAddress, duration: inputDuration, image: Images });
                // const editLocation = Location.findOneAndUpdate(
                //     { "ads._id": adID },
                //     { $set: { "ads.$": updatedAdInfo } })
                const editLocation = await Location.findOneAndUpdate({ "ads._id": adID }, {
                    $set: {
                        "ads.$.name": inputName,
                        "ads.$.type": inputType,
                        "ads.$.size": xy,
                        "ads.$.address": inputAddress,
                        "ads.$.duration": inputDuration

                    }
                });

                console.log(editLocation);
                res.render('so/alert');
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
            res.render('so/request-Edit-Location', result);

        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Internal Server Error');
        }
    }
    async postEditLocation(req, res) {
        try {
            let locationID = req.params.id;
            const inputType = req.body.inputType;
            const inputDetail = req.body.inputDetail;
            const inputCondition = req.body.inputCondition;
            const inputAddress = req.body.inputAddress;
            // Log form data (you can save it to a database or perform any other action)
            const editLocation = await Location.findByIdAndUpdate(locationID, { type: inputType, detail: inputDetail, condition: inputCondition, address: inputAddress });
            console.log(editLocation);
            res.render('alert');
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).send('Unexpected error');
        }
    }

    async requestAd(req, res) {
        try {
            let locationID = req.params.id;
            let LocationData = await Location.findById(locationID);
            console.log(LocationData);
            res.render('so/request-lisencing', LocationData);

        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    async postRequestAd(req, res) {
        try {
            // Sử dụng middleware upload.array như một phần của chuỗi xử lý yêu cầu
            upload.single('images')(req, res, async (err) => {
                if (err) {
                    console.error('Error handling form data:', err);
                    res.status(500).send('Error handling form data');
                    return;
                }
                const formData = req.body;
                const images = req.files || [];
                let LocationData = await Location.findById(req.params.id);
                // Chuyển đổi chuỗi ngày thành đối tượng Date
                const startDate = new Date(formData.dateStar);
                const endDate = new Date(formData.dayend);

                // Tính khoảng cách giữa hai ngày
                const timeDifference = endDate.getTime() - startDate.getTime();

                // Chuyển đổi khoảng cách từ milliseconds sang số ngày
                const daysDifference = timeDifference / (1000 * 3600 * 24);
                let newAd = new Advertisement({
                    name: formData.NameAd,
                    type: formData.type,
                    size: {
                        x: formData.X,
                        y: formData.Y,
                    },
                    owner: formData.inputName,
                    date: formData.dateStar,
                    form: LocationData.type,      // Trường hình thức
                    category: LocationData.detail,
                    duration: daysDifference,
                    address: formData.address,
                    image: images.buffer,
                });
                const updatedLocation = await Location.findOneAndUpdate(
                    { _id: req.params.id },
                    { $push: { ads: newAd } }
                  );
                await newAd.save();
                //res.render('alert2');
                res.render('so/alert');
                // Perform further processing or save data to a database here

            });
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).send('Unexpected error');
        }
    }

    async requestList(req, res) {
        try {

            let requestData = await RequestAd.find();

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
            res.render('so/request-list', { request, wardid: req.user.ward, districtid: req.user.district });
        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Internal Server Error');
        }
    }
 
    async list(req, res) {
        try {
            let adtype =[];
            const result = await Location.find();
            const uniqueAdTypesArray = [...new Map(result.map(location => [location.type, location])).values()];
            console.log(uniqueAdTypesArray);
            uniqueAdTypesArray.forEach(i =>{
                adtype.push({type:i.type});
            })
            console.log(adtype);
            res.render('so/list',{adtype});

        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Internal Server Error');
        }
    }    
 


    async editList(req, res) {
        try {

            let adData = await Report.find();
            let locationData = await ReportLocation.find();
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
            res.render('so/report-list', { locationReports, adReports, wardid: req.user.ward, districtid: req.user.district });
        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Internal Server Error');
        }
    }
    //api
    async deteleLocation(req, res) {
        try {
            const idLocation = req.body.idLocation;
            console.log(idLocation);
            Location.deleteOne({ _id: idLocation });
            const result = await Location.deleteOne({ _id: idLocation });
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

    async deteleAd(req, res) {
        try {
            const idAd = req.body.idAd;
            console.log(idAd);
            const result = await Advertisement.deleteOne({ _id: idAd });
            const updatedLocation = await Location.findOneAndUpdate(
                { "ads._id": idAd },
                { $pull: { ads: { _id: idAd } } });
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



    async updateRequest(req, res) {
        try {

            const requestId = req.body.reportId;
            console.log(requestId);
            if (req.body.condition==0){
            // Thực hiện cập nhật giá trị trong MongoDB
            RequestAd.deleteOne({ _id: requestId });
            const result = await RequestAd.deleteOne({ _id: requestId });

            } else {
                const result = await RequestAd.findOneAndUpdate(  { _id: requestId },
                    { status: 'Đã xử lý' });
                let newAd = new Advertisement({
                    name: result.name,
                    type: result.type,
                    size: {
                        x: result.size.X,
                        y: result.size.Y,
                    },
                    owner: result.owner,
                    date: result.date,
                    form: result.form,      // Trường hình thức
                    category: result.category,
                    duration: result.duration,
                    address: result.address,
                    image: result.Images[0],
                });
                const updatedLocation = await Location.findOneAndUpdate(
                    { _id: result.location },
                    { $push: { ads: newAd } }
                  );
                await newAd.save();
            }
        } catch (error) {
            console.error('Lỗi cập nhật status:', error);
            res.status(500).json({ success: false, message: 'Lỗi cập nhật status' });
        }
    };

}
export default new soController();  
