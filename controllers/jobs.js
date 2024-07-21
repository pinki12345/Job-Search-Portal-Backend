const Job = require("../models/jobs");

exports.createJob = async (req, res, next) => {
  try {
    const {
      name,
      logo,
      position,
      salary,
      location,
      jobType,
      remote,
      description,
      about,
      skills,
      information,
    } = req.body;
    //const skillsArray = skills.split(",").map((data) => data.trim());
    //console.log(req.body)
    if (
      !name ||
      !logo ||
      !position ||
      !salary ||
      !location ||
      !jobType ||
      !remote ||
      !description ||
      !about ||
      !skills ||
      !information
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = req.user;
    const userId = user._id;
   const skillsArray = Array.isArray(skills) ? skills : JSON.parse(skills);
    const job = new Job({
      name,
      logo,
      position,
      salary,
      location,
      jobType,
      remote,
      description,
      about,
      //skills,
      skills: skillsArray,
      information,
      userId,
    });
    await job.save();
    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

exports.getJobs = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "wrong request",
      });
    }
    const data = await Job.findById(id);
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }
    res.status(200).json({
      success: true,
      message: data,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllJobs = async (req, res, next) => {
  try {
    const data = await Job.find().select(
      "name logo position salary remote skills jobType location"
    );
    res.status(200).json({
      success: true,
      message: data,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = req.user;
    const userId = user._id;
    const defaultJobs = await Job.findById(id);
    if (defaultJobs.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this job",
      });
    }
    if (!id) {
      res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }
    await Job.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};

//filtering based on skills
exports.filterJobs = async (req, res, next) => {
  try {
    const skills = req.params.skills;
    if (!skills) {
      return res.status(400).json({
        success: false,
        message: "No skills provided",
      });
    }
    const skillsArray = skills.split(",").map((data) => data.trim());
    const data = await Job.find({ skills: { $in: skillsArray } }).select(
      "name logo position salary remote skills jobType location"
    ); //OR method in searching
    res.status(200).json({
      success: true,
      message: data,
    });
  } catch (err) {
    next(err);
  }
};

//searching based on name, position,jobType, patterens based searching
exports.searchJobs = async (req, res, next) => {
  try {
    const query = req.params.query;
    if (!query) {
      return res.status(400).json({
        success: false,
        message: "No search query provided",
      });
    }
    const data = await Job.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { position: { $regex: query, $options: "i" } },
        { jobType: { $regex: query, $options: "i" } },
      ],
    }).select("name logo position salary remote skills jobType location");
    res.status(200).json({
      success: true,
      message: data,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateJob = async (req, res, next) => {
  try {
    const {id} = req.params;
    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Wrong request",
      });
    }
    const {
      name,
      logo,
      position,
      salary,
      location,
      jobType,
      remote,
      description,
      about,
      skills,
      information,
    } = req.body;
    const user = req.user;
    const userId = user._id;
    const defaultJobs = await Job.findById(id);
    // if (defaultJobs.userId.toString() === userId.toString()) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Access denied",
    //   });
    // }
    const skillsArray = Array.isArray(skills) ? skills : JSON.parse(skills);
    const updatedData = await Job.findByIdAndUpdate(
      id,
      {
        name: name || defaultJobs.name,
        logo: logo || defaultJobs.logo,
        position: position || defaultJobs.position,
        salary: salary || defaultJobs.salary,
        location: location || defaultJobs.location,
        jobType: jobType || defaultJobs.jobType,
        remote: remote || defaultJobs.remote,
        description: description || defaultJobs.description,
        about: about || defaultJobs.about,
        skills: skillsArray || defaultJobs.skills,
        information: information || defaultJobs.information,
        userId: userId || defaultJobs.userId,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      data: updatedData,
    });
  } catch (err) {
    next(err);
  }
};