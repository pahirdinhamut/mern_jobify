import cors from "cors";
import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();

import morgan from "morgan";

//  connect mongos db
import connectDB from "./db/connection.js";
// dotenv
// middleware files
import notFoundMiddleware from "./middleware/node_found.js";
import errorHandleMiddleware from "./middleware/error_handler.js";
import authenticateUser from "./middleware/auth.js";

// Routers
import authRouter from "./routes/authRoutes.js";
import jobsRouter from "./routes/jobsRoutes.js";

app.use(cors());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

//create express json
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ msg: "welcome" });
});

// create routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobsRouter);

// create middleware
app.use(notFoundMiddleware);
app.use(errorHandleMiddleware);

const port = process.env.PORT || 3300;

// mongo DB ye baglaniyouruz
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is runing ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
