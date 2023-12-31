import express, { Router } from "express";
import phuongController from '../controllers/phuongController.js';

const router = express.Router();
router.get('/request-editLocation/:id', phuongController.requestEditLocation) ;
router.post('/request-editLocation/:id', phuongController.postEditLocation);
router.get('/request-edit/:id', phuongController.requestEdit) ;
router.post('/request-edit/:id',phuongController.postEditAd);
router.get('/ad-list', phuongController.adList);
router.get('/', phuongController.home);
export default router;