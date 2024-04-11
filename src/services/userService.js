import db from "../models/index";
import bcrypt from "bcryptjs";

let handleUserLogin = (email, password) => {
    // vi ham checkUserEmail tra ve 1 promise nen can thoi gian => can phai cho no thuc thi xong
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                // user already exist
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ["email", "roleId", "password"],
                    raw: true,
                });
                if (user) {
                    // check lai lan nua vi biet dau khi minh thuc hien xong cau tren thi vua co ng khac vao xoa
                    // compare password
                    let check = bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "Ok";
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = "User not found";
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = `Your email is not exist in our system. Plz try other email!`;
            }

            resolve(userData);
        } catch (err) {
            reject(err);
        }
    });
};

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
            });
            if (user) resolve(true);
            else resolve(false);
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    handleUserLogin: handleUserLogin,
};
