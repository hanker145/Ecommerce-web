import { hashPassword, comparePassword } from "../helpers/authHelper.js";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import JWT from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { validationResult, check } from "express-validator";

const JWT_SECRET = process.env.JWT_SECRET;

export const registerController = [
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Invalid email address"),
  check("password").notEmpty().withMessage("Password is required"),
  check("phone")
    .notEmpty()
    .withMessage("Phone is required. Please enter the correct number"),
  check("address").notEmpty().withMessage("Address is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, email, password, phone, address } = req.body;

      // if (!name) {
      //   return res.send({ message: "Name is Required" });
      // }
      // if (!email) {
      //   return res.send({ message: "Email is Required" });
      // }
      // if (!password) {
      //   return res.send({ message: "Password is Required" });
      // }
      // if (!phone) {
      //   return res.send({ message: "Phone is Required" });
      // }
      // if (!address) {
      //   return res.send({ message: "Address is Required" });
      // }

      const existingUser = await userModel.findOne({ email });

      if (existingUser) {
        return res.status(200).send({
          sucess: false,
          message: "Already Register please login",
        });
      }

      const hashedPassword = await hashPassword(password);
      const user = await new userModel({
        name,
        email,
        phone,
        address,
        password: hashedPassword,
      }).save();

      res.status(201).send({
        success: true,
        message: "User Register Successfully",
        user,
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Error in Registration",
        error,
      });
    }
  },
];

//post login
export const loginController = [
  check("email").isEmail().notEmpty().withMessage("Invalid email"),
  check("password").notEmpty().withMessage("Password is required"),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: errors.array(),
        });
      }
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(401).send({
          success: false,
          message: "Invalid email or password",
        });
      }
      //check user
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(401).send({
          success: false,
          message: "Email is not registered",
        });
      }
      const match = await comparePassword(password, user.password);
      if (!match) {
        return res.status(200).send({
          success: false,
          message: "Invalid Password",
        });
      }
      //token
      const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({
        success: true,
        message: "login successfully",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      res.status(500).send({
        sucess: false,
        message: "Error in login",
        error,
      });
    }
  },
];

//forgotPasswordController
export const forgotPasswordController = [
  check("email").isEmail().notEmpty().withMessage("Invalid email"),
  async (req, res) => {
    const { email } = req.body;
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await userModel.findOne({ email });
      if (!user) {
        return res.json({ status: "User Not Exists!!" });
      }

      const secret = JWT_SECRET + user.password;
      const token = JWT.sign({ email: user.email, id: user._id }, secret, {
        expiresIn: "5m",
      });

      const link = `${process.env.API_HOST}/reset-password/${user._id}/${token}`;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.USER_EMAIL,
          pass: process.env.USER_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.USER_EMAIL,
        to: email,
        subject: "Password Reset",
        text: link,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return res.status(500).json({ error: "Error in sending email" });
        } else {
          return res.json({ status: "Email has been sent" });
        }
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Error in forgot password",
        error: error.message,
      });
    }
  },
];

//reset password
export const resetPasswordController = async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
  const user = await userModel.findOne({ _id: id });
  if (!user) {
    return res.json({ status: "User Not Exists!!" });
  }
  const secret = JWT_SECRET + user.password;
  try {
    const verify = JWT.verify(token, secret);
    res.redirect(
      `${process.env.API_HOST}/reset-password/${user._id}/${verify.token}`
    );
  } catch (error) {
    console.log(error);
    res.json("Not Verified");
  }
};

export const confirmResetPasswordController = [
  check("password").notEmpty().withMessage("Password is required"),
  async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await userModel.findOne({ _id: id });
    if (!user) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + user.password;
    try {
      const verify = JWT.verify(token, secret);
      const encryptedPassword = await bcrypt.hash(password, 10);

      await userModel.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            password: encryptedPassword,
          },
        }
      );
      res.json({ status: 200, message: "Password Reset Successful" });
    } catch (error) {
      console.log(error);
      res.json({ status: "Something Went Wrong" });
    }
  },
];

//update profile
export const updateProfileController = [
  check("name").optional().notEmpty().withMessage("Name is required"),
  check("email").optional().isEmail().withMessage("Invalid email address"),
  check("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  check("address").optional().notEmpty().withMessage("Address is required"),
  check("phone").optional().notEmpty().withMessage("Phone is required"),

  async (req, res) => {
    try {
      const { name, email, password, address, phone } = req.body;
      const user = await userModel.findById(req.user._id);

      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Password
      if (password && password.length < 6) {
        return res.json({
          error: "Password must be at least 6 characters long",
        });
      }

      const hashedPassword = password
        ? await hashPassword(password)
        : undefined;
      const updatedUser = await userModel.findByIdAndUpdate(
        req.user._id,
        {
          name: name || user.name,
          password: hashedPassword || user.password,
          phone: phone || user.phone,
          address: address || user.address,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "Profile updated successfully",
        updatedUser,
      });
    } catch (error) {
      res.status(400).send({
        success: false,
        message: "Error while updating profile",
        error,
      });
    }
  },
];

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};
//orders
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products")
      .populate("buyer", "name");

    res.json(orders);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

//order status
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.useParams;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error While Updating Order",
      error,
    });
  }
};
