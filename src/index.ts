import express from "express";
import authRouter from "./routes/auth";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/errorMiddleware";
import config from "./config";
import testRouter from "./routes/test";

const app = express();

app.get("/", (req, res) => {
  res.send("Server listening on port 8080");
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

app.use("/auth", authRouter);
app.use("/", testRouter);

app.use(errorMiddleware);

const start = async () => {
  try {
    app.listen(config.port, () =>
      console.log(`Server listening on port ${config.port}`)
    );
  } catch (e) {
    console.log(e);
  }
};

start();
