import { Router } from "express";

import chatControllers from "../../controllers/chatControllers";
import authMiddleware from "../../middlewares/authMiddleware";

const chatsRouter = Router();

chatsRouter.use(authMiddleware);

chatsRouter
    .route("/")
    .post(chatControllers.startChat)
    .get(chatControllers.getChats);

chatsRouter.get("/history", chatControllers.getChatHistory);

export default chatsRouter;
