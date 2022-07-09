import { Router } from "express";

import { validateKey } from "../Middlewares/validateAPIKey.js";
import { validateCardType } from "../Middlewares/validateCard.js";
import { activateCard, createCard, getCardInfo } from "../Controllers/cardController.js";

const cardRouter = Router();

cardRouter.post("/card/create", validateKey, validateCardType, createCard);
cardRouter.post("/card/activation/:id", activateCard);
cardRouter.get("/card/info/:id", getCardInfo);

export default cardRouter;