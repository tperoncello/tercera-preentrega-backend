import { Router } from "express";
import passport from "passport";
import { uploadFileController } from "../controllers/documents.controller";

const router = Router();


router.get('/Upload-file', passport.authenticate('current', { session: false }), uploadFileController);


export default router;