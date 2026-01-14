import { Router } from "express";
import userController from "../controllers/userController.js";
import middlewareController from "../controllers/middlewareController.js";

const router = Router();

router.get("/",middlewareController.verifyToken, userController.getAllUser);
router.delete("/:id",middlewareController.verifyTokenAndAdminAuth,userController.deleteUser);

export default router;