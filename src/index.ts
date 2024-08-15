import "reflect-metadata";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import http from 'http';
import connectToDB from "./data/database";
import { UserRoutes } from "./routers/userRoute";

const app = express();

const server = http.createServer(app);

app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization, multipart/form-data"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const userRoutes = new UserRoutes();

app.use("/api/users", userRoutes.router);
const startServer = async () => {
  try {
      await connectToDB();
      const PORT = process.env.PORT || 3000;
      server.listen(PORT, () => {
          console.log(`Server started on port ${PORT}`);
      });
  } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1); 
  }
};

startServer()