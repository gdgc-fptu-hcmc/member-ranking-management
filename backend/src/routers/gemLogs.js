import { Router } from "express";
import middlewareController from "../controllers/middlewareController.js";
import gemLogsController from "../controllers/gemLogsController.js";



const router = Router();

///Admin endpoint

// GET /v1/gem-logs/users/:id get history of gems by users.user_id

router.get("/users/:id",
  middlewareController.verifyTokenAndAdminAuth,
  gemLogsController.getUserGemLogs
);

//POST /v1/gem-logs/users/:id/adjust-gem
router.post("/users/:id/adjust-gem",
    middlewareController.verifyTokenAndAdminAuth,
    gemLogsController.adjustUserGems
)

export default router;