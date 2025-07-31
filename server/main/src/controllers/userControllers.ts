import type { Request, Response } from "express";
import asyncWrapper from "../lib/asyncWrapper";
import { removeAuthCookie, setAuthCookie } from "../lib/cookie";
import { APIResponseError } from "../lib/error/apiError";
import usersService from "../services/userService";

const login = asyncWrapper(async (req: Request, res: Response) => {
    const { credential: credentialFromGoogleAuth } = req.body;
    const user = await usersService.login({
        credentialFromGoogleAuth,
    });

    if (!user) {
        throw new APIResponseError("Invalid credentials", 401, false);
    }

    setAuthCookie(res, user);

    res.status(200).json({
        success: true,
        message: "Login successful",
        data: user,
    });
});

const logout = asyncWrapper(async (req: Request, res: Response) => {
    removeAuthCookie(res);
    res.status(200).json({
        success: true,
        message: "Logout successful",
    });
});

const verify = asyncWrapper(async (req: Request, res: Response) => {
    const user = req.user;

    if (!user) {
        throw new APIResponseError("User not found", 404, false);
    }

    res.status(200).json({
        success: true,
        data: user,
    });
});

const deactivateUser = asyncWrapper(async (req: Request, res: Response) => {
    const id = req?.user?._id as string;
    const user = await usersService.deactivateUser(id);

    if (!user) {
        throw new APIResponseError(
            "User not found or already deactivated",
            404,
            false
        );
    }

    res.status(200).json({
        success: true,
        message: "User deactivated successfully",
        data: user,
    });
});

const deleteUser = asyncWrapper(async (req: Request, res: Response) => {
    const id = req?.user?._id as string;
    await usersService.deleteUser(id);
    removeAuthCookie(res);
    res.status(200).json({
        success: true,
        message: "User deleted successfully",
    });
});

const usersController = {
    login,
    logout,
    verify,
    deactivateUser,
    deleteUser,
};

export default usersController;
