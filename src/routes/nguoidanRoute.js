import express from "express";
import nguoidanController from '../controllers/nguoidanController.js';

const router = express.Router();
router.get('/infor/:id', nguoidanController.inforAd) ;
router.use('/', nguoidanController.home);

export default router;