import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";
import bodyParser from "body-parser";

const app = express();

dotenv.config();


app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(express.json());

app.use("/", router);

const PORT = process.env.VITE_PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server running → http://localhost:${PORT}`)
);
