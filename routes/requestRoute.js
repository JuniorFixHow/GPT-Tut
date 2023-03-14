import express  from "express";
import { postRequest } from "../controller/requestController.js";

const router = express.Router();

router.post('/', postRequest)

export default router