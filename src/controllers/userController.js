import userService from "../services/userService";

let handleLogin = async (req, res) => {
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

    // api phai tra ve status
    return res.status(200).json(userData); // chi tra json
};

let handleGetAllUsers = async (req, res) => {
    let id = req.query.id; // ALL or ID
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters",
            users: [],
        });
    }
    let users = await userService.getAllUsers(id);

    return res.status(200).json({
        errCode: 0,
        errMessage: "OK",
        users,
    });
};

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
};
