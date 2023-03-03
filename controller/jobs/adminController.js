const userModel = require('../../model/Jobs/Admin');
const {
  hashedPassword,
  comparePassword,
  createToken,
} = require('../../services/authServices');

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({
      email,
    });
    if (user) {
      return res.status(400).json({ message: 'User Already Exists' });
    }
    const hashed = await hashedPassword(password);
    const newUser = new userModel({ email, password: hashed });
    await newUser.save();
    res.status(201).json({ message: 'User Created Succesfully', newUser });
  } catch (e) {
    res.status(400).json({ message: 'Something went wrong', e });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({
      email,
    });
    if (!user) {
      return res.status(400).json({ message: 'User Does Not Exist' });
    }
    const isMatch = await comparePassword(password, user.password);
    const token = createToken({ id: user._id, name: user.name });
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }
    res
      .status(200)
      .json({ message: 'User Logged In Succesfully', user, token });
  } catch (e) {
    res.status(400).json({ message: 'Something went wrong', e });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).json({ message: 'Users Fetched Succesfully', users });
  } catch (e) {
    res.status(400).json({ message: 'Something Went Wrong', e });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'User Deleted Succesfully', user });
  } catch (e) {
    res.status(400).json({ message: 'Something Went Wrong', e });
  }
};

module.exports = { registerUser, loginUser, getUsers, deleteUser };
