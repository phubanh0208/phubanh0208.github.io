import express, { Router } from "express";
import phuongController from '../controllers/phuongController.js';

const router = express.Router();
router.use('/update-request',phuongController.updateRequest);
router.get('/request-list',phuongController.requestList);
router.get('/request-lisencing', phuongController.requestAd) ;
router.post('/request-lisencing',phuongController.postRequestAd);
router.post('/updateStatus', phuongController.updateStatus); // Đặt tên và đường dẫn endpoint theo ý muốn
router.get('/infor/:id', phuongController.inforAd) ;
router.get('/reports-list', phuongController.reportList) ;
router.get('/request-editLocation/:id', phuongController.requestEditLocation) ;
router.post('/request-editLocation/:id', phuongController.postEditLocation);
router.get('/request-edit/:id', phuongController.requestEdit) ;
router.post('/request-edit/:id',phuongController.postEditAd);
router.get('/ad-list', phuongController.adList);
router.get('/', phuongController.home);
export default router;