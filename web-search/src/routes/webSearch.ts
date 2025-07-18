import { Router } from "express";
import webSearchController from "../controllers/webSearchController";

const router = Router();

router.get("/", webSearchController.webSearch);

export default router;
