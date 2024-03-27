import db from '../models/index'

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();

        // vi trong view Engine da set duong path views
        console.log(JSON.stringify(data));
        return res.render("homepage.ejs", {
            data: JSON.stringify(data)
        }); // data dang la JSON ==> chuyen thanh chuoi JSON => (khi nao su dung thi chuyen sang JS Obj)
    } catch (err) {
        console.log(err);
    }
   
} 

let getAboutPage = (req, res) => {
    return res.render("test/about.ejs")
}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage
}