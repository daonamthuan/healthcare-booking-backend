import userService from "../services/userService";

let handleLogin = async (req, res) => {
    // api phai tra ve status
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        // shorter way to write code: if (email == '' || email === null || email == 'undefined')
        return res.status(500).json({
            errCode: 1,
            message: "Missing inputs parameter!",
        });
    }

    let userData = await userService.handleUserLogin(email, password);

    return res.status(200).json(userData);
};

module.exports = {
    handleLogin: handleLogin,
};
