import express, { Router } from "express";
import phuongController from '../controllers/phuongController.js';

const router = express.Router();
router.use('/', phuongController.home);
export default router;