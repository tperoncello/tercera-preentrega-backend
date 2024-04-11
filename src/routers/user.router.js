import { Router } from "express";
import { 
    getUsersController,
    getUsertByIdController,
    addUserController,
    updateUser,
    deleteUser,
    getAdminsController,
    getPremiumsController,
    getNormalController,
    upgradeToPremiumController,
    sendDocumentsController
} from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/", getUsersController);

router.get("/:uid", getUsertByIdController);

router.post("/", addUserController);

router.put("/:uid", updateUser);

router.delete("/", deleteUser);

router.get('/users/admin', getAdminsController);

router.get('/users/premium', getPremiumsController);

router.get('/users/user', getNormalController);

router.get('/premium/:uid', upgradeToPremiumController)

router.post('/:uid/documents', upload.single('file'), sendDocumentsController);


export default router;