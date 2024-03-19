import express from "express"

// dung bien let thay vi var (var: global, let : scope)
let configViewEngine = (app) => {
    app.use(express.static("./src/public"));
    app.set("view engine", "ejs");
    app.set("views", "./src/views");
}

module.exports = configViewEngine;