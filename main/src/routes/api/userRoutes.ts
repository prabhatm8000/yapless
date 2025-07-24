import { Router } from "express";
import { authRateLimiter } from "../../constants/authConfig";
import usersController from "../../controllers/userControllers";
import authMiddleware from "../../middlewares/authMiddleware";

const usersRouter = Router();

// auth routes with a lil stricter rate limiter
const authRoutes = Router();
authRoutes.use(authRateLimiter);
authRoutes.post("/login", usersController.login);

// other routes
usersRouter.use("/", authRoutes);
usersRouter.post("/logout", [authMiddleware], usersController.logout);

usersRouter.get("/verify", [authMiddleware], usersController.verify);

usersRouter.delete("/delete", [authMiddleware], usersController.deleteUser);

usersRouter.post(
    "/deactivate",
    [authMiddleware],
    usersController.deactivateUser
);

export default usersRouter;
