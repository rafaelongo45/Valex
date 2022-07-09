import { Router } from "express";

import { postPurchase } from "../Controllers/paymentController.js";

const purchasesRouter = Router();

purchasesRouter.post("/purchase/:businessId", postPurchase);

export default purchasesRouter;