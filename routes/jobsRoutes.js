import express from "express";

const router = express.Router();

import {
  createJob,
  getAllJobs,
  updateJob,
  deleteJob,
  showStatus,
} from "../controllers/jobsController.js";

router.route("/").post(createJob).get(getAllJobs);
// remember about :id
router.route("/stats").get(showStatus);

//  routerden id parametri gonderek delete islemi hem patch islemi yapiyoruz
router.route("/:id").delete(deleteJob).patch(updateJob);

export default router;
