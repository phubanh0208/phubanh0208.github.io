import express, { Router } from "express";
import phuongController from '../controllers/phuongController.js';

const router = express.Router();
router.get('/ad-list', phuongController.adList);
router.get('/', phuongController.home);
export default router;