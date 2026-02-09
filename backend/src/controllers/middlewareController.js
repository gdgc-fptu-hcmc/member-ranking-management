import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const middlewareController = {
  verifyToken: (req, res, next) => {
  const authHeader = req.headers.authorization; // ✅ đúng chuẩn

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json("You're not authenticated");
  }

  const accessToken = authHeader.split(" ")[1];

  jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
    if (err) {
      return res.status(403).json("Token is not valid");
    }

    req.user = user;
    next();
  });
},
  verifyTokenAndAdminAuth: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      const roles = req.user?.roles ?? []; // ✅ không crash
      const isAdmin = roles.includes("admin");
      const isBDH = roles.includes("bdh");
      if ( isAdmin || isBDH) {
        next();
      } else {
        res.status(403).json("Access denied. You do not have the required permissions");
      }
    });
  },
  // Verify user can only access their own data
  verifySelfAuth: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
      // For /me endpoints, user can always access their own data
      next();
    });
  },
};
export default middlewareController;
