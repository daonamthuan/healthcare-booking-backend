import db from "../models/index";
import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();

        // vi trong view Engine da set duong path views
        console.log(JSON.stringify(data));
        return res.render("homepage.ejs", {
            data: JSON.stringify(data),
        }); // data dang la JSON ==> chuyen thanh chuoi JSON => (khi nao su dung thi chuyen sang JS Obj)
    } catch (err) {
        console.log(err);
    }
};

let getAboutPage = (req, res) => {
    return res.render("test/about.ejs");
};

let getCRUD = (req, res) => {
    return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(req.body);
    console.log(message);
    return res.send("Post CRUD from server");
};

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();

    return res.render("displayCRUD.ejs", { dataTable: data });
};

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    console.log(userId);
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);

        return res.render("editCRUD.ejs", { user: userData });
    } else {
        return res.send("User not found");
    }
};

let putCRUD = async (req, res) => {
    let data = req.body; // lay thong tin tu form thi put len
    let allUsers = await CRUDService.updateUserData(data);

    return res.render("displayCRUD.ejs", { dataTable: allUsers });
};

let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    console.log(id);
    if (id) {
        await CRUDService.deleteUserById(id);

        return res.send("Delete User successfully!");
    } else {
        return res.send("Delete error");
    }
};

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayGetCRUD: displayGetCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD,
};
