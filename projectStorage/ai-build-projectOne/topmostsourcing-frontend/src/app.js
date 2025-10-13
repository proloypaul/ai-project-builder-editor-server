import "express-async-errors";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { connectToDB } from "./db/connect.js";
import { config } from "../config/index.js";
import userRoute from "./routes/user.route.js";
import investorRoute from "./routes/investor.route.js";
import investRoute from "./routes/invest.route.js";
import productRoute from "./routes/product.route.js";
import roiRoute from "./routes/roi.route.js";
import blogRoute from "./routes/blog.route.js";
import categoryRoute from "./routes/category.route.js";
import productParentCategoryRoute from "./routes/product-parent-category.route.js";
import productCategoryRoute from "./routes/product-category.route.js";
import productSubategoryRoute from "./routes/product-subcategory.js";
import { routeNotFound } from "./middlewares/routeNotFound.js";
import { errorHandlerMiddleware } from "./middlewares/errorHandler.js";
import compression from "compression";

const app = express();

//app.set("trust proxy", 1);
// app.use(
//   rateLimit({
//     windowMs: 10 * 60 * 1000,
//     max: 100,
//   })
// );
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(xss());
app.use(mongoSanitize());
app.use(
  cors({
    origin: [
      "http://192.168.0.104:3000",
      "http://localhost:3000",
      "https://www.topmostsourcingltd.com",
      "https://topmostsourcingltd.com",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(
  "/",
  express.static("uploads", {
    setHeaders: (res, path) => {
      res.set("Cache-Control", "public, max-age=7200");
    },
  })
);

const port = config.port || 3001;

app.use(compression());
app.use("/api/v1/user", userRoute);
app.use("/api/v1/investor", investorRoute);
app.use("/api/v1/invest", investRoute);
app.use("/api/v1/roi", roiRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/blog", blogRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product-parent-category", productParentCategoryRoute);
app.use("/api/v1/product-category", productCategoryRoute);
app.use("/api/v1/product-subcategory", productSubategoryRoute);

app.get("/", (req, res) => {
  res.send("Top most outsourcing");
});

app.use(routeNotFound);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await connectToDB(config.mongoUri);
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
