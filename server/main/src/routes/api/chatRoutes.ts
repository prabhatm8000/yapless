import { Router } from "express";

import chatControllers from "../../controllers/chatControllers";
import authMiddleware from "../../middlewares/authMiddleware";

const chatsRouter = Router();

chatsRouter.use(authMiddleware);
chatsRouter.get("/history", chatControllers.getChatHistory);

chatsRouter
    .route("/")
    .post(chatControllers.startChat)
    .get(chatControllers.getChats);

chatsRouter
    .route("/:sessionId")
    .get(chatControllers.getChatBySessionId)
    .delete(chatControllers.deleteSession);

export default chatsRouter;
