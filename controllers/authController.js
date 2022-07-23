import User from "../models/User.js";
import "express-async-errors";
import { StatusCodes } from "http-status-codes";

import { BadRequestError, UnauthenticationError } from "../errors/index.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // controller empty values
  if (!name || !email || !password) {
    throw new BadRequestError("please provide all values");
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use ");
  }

  const user = await User.create({ name, email, password });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: { email: user.email, lastName: user.lastName, name: user.name },
    token,
    location: user.location,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  // chack values is not empty
  if (!email || !password) {
    throw new BadRequestError("please provide all values!");
  }
  // chack to user is not register,
  const user = await User.findOne({ email }).select("+password"); // asil passwordu aktif hale getirip isleme sokuyouruz
  if (!user) {
    throw new UnauthenticationError("Incalid Creadentials !!");
  }

  // kayitta olan passwordu eslestiryoruz
  const isPasswordCorrenct = await user.comparePassword(password);
  if (!isPasswordCorrenct) {
    throw new UnauthenticationError("Invalid credentials");
  }
  // token gonderiyouruz
  const token = user.createJWT();

  // burada password'u yok ediyoruz
  user.password = undefined;

  // tum islemler basarili oldugunda kullanciyi json verisi ile gonderiyoruz
  res.status(StatusCodes.OK).json({
    user,
    token,
    location: user.location,
  });
};

const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;
  //  check input valuses
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError("Please provide all values");
  }
  // finde user
  const user = await User.findOne({ _id: req.user.userId });
  // chenge user values
  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  // save update user accound
  await user.save();

  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user,
    token,
    location: user.location,
  });
};

export { register, login, updateUser };
