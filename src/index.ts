import express from "express";
import authRouter from "./routes/auth";
import cors from "cors";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 8080;

const app = express();

app.get("/", (req, res) => {
  res.send("Server listening on port 8080");
});

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/auth", authRouter);

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
