import chalk from "chalk";
import dotenv from "dotenv";
import express from "express";
import "express-async-errors";

import router from "./Routers/index.js";
import { handleError } from "./Middlewares/errorHandler.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(router);
app.use(handleError);

app.listen(process.env.PORT, 
  () => console.log(chalk.bold.green(`Server running on port ${process.env.PORT}`))
);