import Job from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";
import checkPermissions from "../utils/checkPermissions.js";
import mongoose from "mongoose";
import moment from "moment";

// create job contorller
const createJob = async (req, res) => {
  const { position, company } = req.body;
  // required values check
  if (!position || !company) {
    throw new BadRequestError("Please Provide All Values");
  }
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const getAllJobs = async (req, res) => {
  const { search, status, jobType, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (status && status !== "all") {
    queryObject.status = status;
  }

  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  // NO Await
  let result = Job.find(queryObject);

  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }

  //   setup paginations

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  //    75
  // 10 10 10 10 10 10 10 10 5

  result = result.skip(skip).limit(limit);

  //chain sort conditions
  const jobs = await result;

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};
const updateJob = async (req, res) => {
  // use router send job id params
  const { id: jobId } = req.params;

  const { company, position } = req.body;

  if (!company || !position) {
    throw new BadRequestError("Pleace Provide All Values !");
  }
  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  // check permossions

  const updateJob = await Job.findByIdAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });
  // job.position = position;
  // job.company = company;
  // job.jobLocation = jobLocation;
  // await job.save();
  // console.log(typeof req.user.userId);
  // console.log(typeof job.createdBy);

  checkPermissions(req.user, job.createdBy);

  res.status(StatusCodes.OK).json({ updateJob });
};
const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;
  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  checkPermissions(req.user, job.createdBy);

  await job.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! job removed" });
};
const showStatus = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  stats = stats.reduce((acc, curr) => {
    // acc -> ilk toplam degiri tutan degisken  curr -> o an islem yatigimiz oge
    const { _id: title, count } = curr;
    //  buradiki title ile count  curr isleme atiyouruz
    acc[title] = count;
    return acc;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplication = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": -1, "_id.month": -1 },
    },
    {
      $limit: 6,
    },
  ]);
  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const data = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { data, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplication });

  res.send("show status Job");
};

export { createJob, getAllJobs, updateJob, deleteJob, showStatus };
