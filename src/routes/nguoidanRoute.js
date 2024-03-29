import express, { Router } from "express";
import nguoidanController from '../controllers/nguoidanController.js';

const router = express.Router();
router.get('/reportLocation/', nguoidanController.reportLocation) ;
router.post('/reportLocation/',nguoidanController.postReportLocation);
router.use('/report-detail',nguoidanController.reportDetail);
router.get('/report/:id', nguoidanController.reportAd) ;
router.post('/report/:id',nguoidanController.postReportAd);
router.get('/infor/:id', nguoidanController.inforAd) ;
router.get('/', nguoidanController.home);
export default router;
