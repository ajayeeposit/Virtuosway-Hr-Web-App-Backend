const jobModel = require('../../model/Jobs/Job');

const createJob = async (req, res) => {
  const {
    title,
    employmentType,
    minExperience,
    company,
    descriptions,
    qnrs,
    country,
    city,
    status,
    jobType,
  } = req.body;
  try {
    const job = new jobModel({
      title,
      employmentType,
      minExperience,
      company,
      descriptions,
      qnrs,
      country,
      city,
      status,
      jobType,
    });
    await job.save();
    res.status(201).json({ message: 'Job Created SUccesfully', job });
  } catch (e) {
    res.status(400).send(e);
  }
};

const getJobs = async (req, res) => {
  try {
    const allJobs = await jobModel.find({}).sort({ createdAt: -1 })
    const jobs = allJobs.filter((item) => item.status === 'open')
    const Count = await jobModel.countDocuments({});

    res.status(200).json({ message: 'Jobs Fetched Succesfully', jobs, Count });
  } catch (e) {
    res.status(400).json({ message: 'Something Went Wrong', e });
  }
};

const getJobById = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await jobModel.findById(id);
    res.status(200).json({ message: 'Job Fetched Succesfully', job });
  } catch (e) {
    res.status(400).json({ message: 'Something Went Wrong', e });
  }
};

const searchJobs = async (req, res) => {
  const { title } = req.params;
  try {
    const jobs = await jobModel.find({
      title: { $regex: title, $options: 'i' },
    });
    res
      .status(200)
      .json({ message: 'Searched Jobs Fetched Succesfully', jobs });
  } catch (e) {
    res.status(400).json({ message: 'Something Went Wrong', e });
  }
};

const deleteJob = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await jobModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Job Deleted Succesfully', job });
  } catch (e) {
    res.status(400).json({ message: 'Something Went Wrong', e });
  }
};

const updateJob = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    employmentType,
    minExperience,
    company,
    descriptions,
    qnrs,
    country,
    city,
    status,
    jobType,
  } = req.body;
  try {
    const job = await jobModel.findByIdAndUpdate(
      id,
      {
        title,
        employmentType,
        minExperience,
        company,
        descriptions,
        qnrs,
        country,
        city,
        status,
        jobType,
      },
      { new: true }
    );
    res.status(200).json({ message: 'Job Updated Succesfully', job });
  } catch (e) {
    res.status(400).json({ message: 'Something Went Wrong', e });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  deleteJob,
  searchJobs,
  updateJob,
};
