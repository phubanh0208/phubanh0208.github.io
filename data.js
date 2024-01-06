import fs from 'fs';
import moment from 'moment';
import { v4 as  uuidv4 } from 'uuid';

const inputFilePath = './ad-manage.locations.json';

// Đọc nội dung từ file
fs.readFile(inputFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Đã xảy ra lỗi khi đọc file:', err);
      return;
    }
    
    // Chuyển đổi nội dung JSON thành đối tượng JavaScript
    try {
      const jsonData = JSON.parse(data);
      const allAds = [];
      // Cập nhật trường "form" và "category" trong mảng "ads"
      jsonData.forEach(item => {
        item.ads.forEach(ad => {
          ad.form = item.type;
          ad.category = item.detail;
          ad.duration = 360;
          ad.address = item.address;
          ad._id = { $oid: generateShortId() };
          allAds.push(ad);
        });
      });
  
      // Đường dẫn tới file JSON mới để lưu
      const outputFilePath = './ad-manage.locations2.json';
      const outputFilePath2 = './ad-manage.json';

      // Ghi dữ liệu đã cập nhật vào file mới
      fs.writeFile(outputFilePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('Đã xảy ra lỗi khi ghi file:', writeErr);
        } else {
          console.log('Dữ liệu đã được lưu vào file mới thành công.');
        }
      });
      fs.writeFile(outputFilePath2, JSON.stringify(allAds, null, 2), 'utf8', (writeErr) => {
        if (writeErr) {
          console.error('Đã xảy ra lỗi khi ghi file:', writeErr);
        } else {
          console.log('Dữ liệu đã được lưu vào file mới thành công.');
        }
      });

    } catch (parseError) {
      console.error('Đã xảy ra lỗi khi chuyển đổi JSON:', parseError);
    }
  });

  function generateShortId() {
    const characters = '0123456789';
    let id = '';
  
    for (let i = 0; i < 24; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters.charAt(randomIndex);
    }
  
    return id;
  }