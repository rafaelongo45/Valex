import { Router } from "express";

import { validateKey } from "../Middlewares/validateAPIKey.js";
import { rechargeCard } from "../Controllers/rechargeController.js";

const rechargeRouter = Router();

rechargeRouter.post("/recharge/:id", validateKey, rechargeCard);

export default rechargeRouter;