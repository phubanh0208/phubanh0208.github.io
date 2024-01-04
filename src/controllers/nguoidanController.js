import Location from "../models/location.js";
import Advertisement from "../models/advertisement.js";
class nguoidanController {
    // [GET] /work
    async home(req, res) {
        try {
            const locationData = JSON.stringify(await Location.find());
            console.log(locationData);
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
            console.log('Found Documents:', result);
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
            console.log('Found Documents:', result);
            res.render('report',result);
        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Infor AD Error');
        }
    }
    async postReportAd(req, res) {
        try {
            const formData = req.body;
            // Xử lý dữ liệu tùy theo nhu cầu của bạn
            console.log('Received form data:', formData);
            res.send('Data received successfully!');
        
        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Infor AD Error');
        }
    }

}
export default new nguoidanController();  
