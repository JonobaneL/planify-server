import express from "express";
import authRouter from "./routes/auth";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/errorMiddleware";
import config from "./config";
import testRouter from "./routes/test";
import projectsRouter from "./routes/projects";

const app = express();

app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(
  cors({
    origin: config.frontendUrl, // e.g., 'http://localhost:3000'
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Server listening on port 8080");
});

app.use("/auth", authRouter);
app.use("/test", testRouter);
app.use("/projects", projectsRouter);

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
