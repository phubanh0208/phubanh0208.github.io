import express, { Router } from "express";
import soController from '../controllers/soController.js';

const router = express.Router();
router.get('/edit-list',soController.editList)
router.get('/list',soController.list);
router.use('/detele-location',soController.deteleLocation);
router.use('/detele-ad',soController.deteleAd);
router.use('/update-request',soController.updateRequest);

router.get('/request-list',soController.requestList);

router.get('/add-ads/:id', soController.requestAd) ;
router.post('/add-ads/:id',soController.postRequestAd);
router.get('/infor/:id', soController.inforAd) ;
router.get('/reports-list', soController.reportList) ;
router.get('/request-editLocation/:id', soController.requestEditLocation) ;
router.post('/request-editLocation/:id', soController.postEditLocation);

router.get('/admin-edit/:id', soController.requestEdit) ;
router.post('/admin-edit/:id',soController.postEditAd);
router.get('/ads-manage', soController.adList);
router.get('/', soController.home);
export default router;