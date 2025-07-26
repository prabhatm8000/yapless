import { Router } from "express";

import chatControllers from "../../controllers/chatControllers";

const chatsRouter = Router();

chatsRouter.post("/", chatControllers.startChat);

chatsRouter.get("/history", chatControllers.getChatHistory);

export default chatsRouter;
