import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

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

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = {};
            if (userId === "ALL") {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ["password"],
                    },
                });
            }
            if (userId && userId !== "ALL") {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ["password"],
                    },
                });
            }
            console.log(users);
            resolve(users);
        } catch (err) {
            reject(err);
        }
    });
};

let hashUserPasword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword); // return doi voi Promise
        } catch (err) {
            reject(e);
        }
    });
};

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // check email exist first
            let check = await checkUserEmail(data.email);
            if (check) {
                resolve({
                    errCode: 1,
                    errMessage:
                        "Your email is already exist, plz try another email !",
                });
            } else {
                let hashPasswordFromBcrypt = await hashUserPasword(
                    data.password
                );
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender === "1" ? true : false,
                    roleId: data.roleId,
                });
            }

            resolve({
                errCode: 0,
                errMessage: "OK",
            });
        } catch (err) {
            reject(err);
        }
    });
};

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        let foundUser = await db.User.findOne({ where: { id: userId } });
        if (!foundUser) {
            resolve({
                errCode: 2,
                errMessage: "User isn't exist",
            });
        }

        await db.User.destroy({ where: { id: userId } });

        resolve({
            errCode: 0,
            errMessage: "User is deleted !",
        });
    });
};

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameters !",
                });
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });

            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();

                // await db.User.save({
                //     firstName: data.firstName,
                //     lastName: data.lastName,
                //     address: data.address,
                // });

                resolve({
                    errCode: 0,
                    errMessage: "Update user successfully !",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "User not found !",
                });
            }
        } catch (err) {
            reject(err);
        }
    });
};

let getAllcodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput },
                });
                res.errCode = 0;
                res.data = allcode;

                resolve(res);
            }
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllcodeService: getAllcodeService,
};
