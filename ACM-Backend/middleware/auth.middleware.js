import pkg from "jsonwebtoken";
import User from "../models/users.model.js";
import dotenv from "dotenv";
import { HttpException } from "../utils/HttpException.js";

const { verify } = pkg;

dotenv.config();

const getAuthorization = (req) => {
  // const coockie = req.cookies['Authorization'];
  // if (coockie) return coockie;

  const header = req.header("Authorization");
  if (header) return header.split("Bearer ")[1];

  return null;
};

export const AuthMiddleware = async (req, res, next) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const { id } = await verify(Authorization, process.env.JWT_SECRET);
      const findUser = await User.findById(id);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, "Wrong authentication token"));
      }
    } else {
      next(new HttpException(404, "Authentication token missing"));
    }
  } catch (error) {
    next(new HttpException(401, "Wrong authentication token"));
  }
};

export const AdminMiddleware = async (req, res, next) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const { id } = await verify(Authorization, process.env.JWT_SECRET);
      const findUser = await User.findById(id);

      if (findUser && findUser.isAdmin === true) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(403, "You are not authorized to access this resource"));
      }
    } else {
      next(new HttpException(404, "Authentication token missing"));
    }
  } catch (error) {
    next(new HttpException(401, "Wrong authentication token"));
  }
}
