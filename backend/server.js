dotenv.config();
import dotenv from "dotenv";
import express from "express";
import connect from "./database/connect.js";
import mainRoute from "./routes/index.js";
import {corsOptions} from "./security/corsOptions.js";
import {limiter} from "./security/limiter.js";
import path from "path";
import cors from "cors";
import useragent from "express-useragent";

const app = express();
const port = process.env.PORT;

app.use(limiter);
app.use(cors(corsOptions));
app.use(express.json());
app.use(useragent.express());
app.use("/api", mainRoute);
app.use("/uploads", express.static(path.join("./", "uploads")));

app.listen(port, () => {
  console.log(`🚀 Server is working on port ${port}. 🚀`);
  connect();
});
