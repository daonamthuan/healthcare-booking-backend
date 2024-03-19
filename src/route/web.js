import express from "express";
import homeController from "../controllers/homeController"; // homeController nhu 1 object export cua file do


let router = express.Router();

// tat ca route se viet o trong nay
let initWebRoutes = (app) => {
    router.get('/', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage)

    router.get("/hoidanit", (req, res) => {
        return res.send("Hello world from hoidanit route")
    })


    return app.use("/", router); // api bat dau bang "/"
}

module.exports = initWebRoutes;