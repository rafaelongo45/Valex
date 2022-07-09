import { Router } from "express";

import { validateKey } from "../Middlewares/validateAPIKey.js";
import { validateCardType } from "../Middlewares/validateCard.js";
import { activateCard, blockCard, createCard, getCardInfo,unblockCard } from "../Controllers/cardController.js";

const cardRouter = Router();

cardRouter.post("/card/create", validateKey, validateCardType, createCard);
cardRouter.post("/card/activation/:id", activateCard);
cardRouter.get("/card/info/:id", getCardInfo);
cardRouter.post("/card/block/:id", blockCard);
cardRouter.post("/card/unblock/:id", unblockCard)

export default cardRouter;