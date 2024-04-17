import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config(); // goi ham config cua thu vien dotenv

let app = express();
app.use(cors({ credentials: true, origin: true }));
// app.use(cors({ origin: true }));

//config app, cau hinh express co the doc va xu ly cac yeu cau duoi dang json va form
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 6969; // if port is undefined => port = 6969

app.listen(port, () => {
    console.log("Backend Nodejs is running on the port : " + port);
});
