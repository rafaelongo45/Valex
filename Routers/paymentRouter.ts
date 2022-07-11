import { Router } from "express";

import { onlinePurchase, postPurchase } from "../Controllers/paymentController.js";

const purchasesRouter = Router();

purchasesRouter.post("/purchase/:businessId", postPurchase);
purchasesRouter.post("/purchase/online/:businessId", onlinePurchase);

export default purchasesRouter;