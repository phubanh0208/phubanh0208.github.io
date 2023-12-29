import Location from "../models/location.js";
class nguoidanController {
    // [GET] /work
    async home(req, res) {
        try {
            const locationData = JSON.stringify(await Location.find());
            console.log(locationData);
            res.render('home_g',{locationData});
        } catch (error) {
            console.error('Error retrieving location data:', error);
            res.status(500).send('Internal Server Error');
        }
    }
    
}
export default new nguoidanController();  
