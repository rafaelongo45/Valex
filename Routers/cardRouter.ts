import { Router } from "express";

import { createCard } from "../Controllers/cardController.js";
import { validateKey } from "../Middlewares/validateAPIKey.js";
import { validateCardType } from "../Middlewares/validateCard.js";

const cardRouter = Router();

cardRouter.post("/card/create", validateKey, validateCardType, createCard);

export default cardRouter;