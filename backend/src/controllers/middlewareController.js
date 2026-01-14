import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const middlewareController = {
  //verifyToken
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      //Baerer 122345
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
        if (err) {
          return res.status(403).json("Token is not valid");
        }
        req.user = user;
        next();
      });
    } else {
      res.status(401).json("You're not authenticated");
    }
  },
  verifyTokenAndAdminAuth: (req, res, next) => {
    middlewareController.verifyToken(req, res, () => {
     const roles = req.user?.roles ?? [];     // ✅ không crash
      const isSelf = req.user?.id === req.params.id;
      const isAdmin = roles.includes("admin");
      const isBDH = roles.includes("bdh");
      if (isSelf || isAdmin || isBDH) {
        next();
      }
      else{
        res.status(403).json("you're not allowed to delete other");
      }
    });
  },
};
export default middlewareController;
