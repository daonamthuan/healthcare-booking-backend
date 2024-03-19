let getHomePage = (req, res) => {
    return res.render("homepage.ejs"); // vi trong view Engine da set duong dan views
}

let getAboutPage = (req, res) => {
    return res.render("test/about.ejs")
}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage
}