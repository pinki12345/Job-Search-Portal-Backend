const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/user");
const {login,signup} = require("../controllers/user");
const {createJob,getJobs,deleteJob,getAllJobs,updateJob,filterJobs,searchJobs} = require("../controllers/jobs");

router.post("/login",login)
router.post("/signup",signup)

router.post("/createJob",authMiddleware,createJob)

router.get("/getJobs/:id",getJobs)

// router.get("/getAllJobs",getAllJobs)
router.get("/getAllJobs",getAllJobs)

router.delete("/deleteJob/:id",authMiddleware,deleteJob)
router.patch("/updateJob/:id",authMiddleware,updateJob)
router.get ("/filterJobs/:skills",filterJobs)

// router.get("/searchJobs/:query",authMiddleware,searchJobs)
router.get("/searchJobs/:query",searchJobs)


module.exports = router