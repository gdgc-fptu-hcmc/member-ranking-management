import { Router } from "express";
import activityController from "../controllers/activityController.js";
import middlewareController from "../controllers/middlewareController.js";
import checkInsController from "../controllers/checkInsController.js";

const router = Router();

// =========================================================
// PUBLIC ENDPOINTS
// =========================================================

// GET /v1/activities - Get all activities
router.get("/", activityController.getAllActivities);

// GET /v1/activities/:id - Get activity by ID
router.get("/:id", activityController.getActivityById);

// POST /v1/activities/:id/checkins
router.post(
  "/:activityId/checkins",
  middlewareController.verifyToken,
  checkInsController.submitCheckIn,
);
//GET /v1/activities/member
router.get("/checkins/me", middlewareController.verifyToken,checkInsController.getMyActivities )

// =========================================================
// ADMIN ENDPOINTS (Require admin or bdh role)
// =========================================================

// POST /v1/activities - Create new activity
router.post(
    "/",
    middlewareController.verifyTokenAndAdminAuth,
    activityController.createActivity
);

// PUT /v1/activities/:id - Update activity
router.put(
    "/:id",
    middlewareController.verifyTokenAndAdminAuth,
    activityController.updateActivity
);

// DELETE /v1/activities/:id - Delete activity
router.delete(
    "/:id",
    middlewareController.verifyTokenAndAdminAuth,
    activityController.deleteActivity
);

// GET /v1/activities/:id/participants - Get participants of an activity
router.get(
    "/:id/participants",
    middlewareController.verifyTokenAndAdminAuth,
    activityController.getActivityParticipants
);

export default router;
