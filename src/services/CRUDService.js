import bcrypt from "bcryptjs";
import db from "../models/index";

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
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

            resolve("ok create a new User successfully!");
        } catch (err) {
            reject(err);
        }
    });
};

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword); // return doi voi Promise
        } catch (err) {
            reject(e);
        }
    });
};

let getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true,
            });
            // de thoat khoi promise thi dung resolve (reject tuy tinh huong)
            // resolve ~ return
            resolve(users);
        } catch (err) {
            reject(e);
        }
    });
};

let getUserInfoById = (userId) => {
    // khi can xu ly ket noi DB va tranh bat dong bo (dong bo de xu ly task co ket noi db)
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true,
            });

            if (user) {
                resolve(user);
            } else {
                resolve({});
            }
        } catch (err) {
            reject(err);
        }
    });
};

let updateUserData = (data) => {
    // khi task can ket noi DB va tranh bat dong bo thi nen su dung Promise
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id },
            });

            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();

                let allUser = await db.User.findAll();
                resolve(allUser);
            } else {
                resolve();
            }
        } catch (err) {
            reject(err);
        }
    });
};

let deleteUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
            });

            if (user) {
                await user.destroy();
            }

            resolve(); // tuong duong return trong Promise
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    createNewUser: createNewUser,
    getAllUser: getAllUser,
    getUserInfoById: getUserInfoById,
    updateUserData: updateUserData,
    deleteUserById: deleteUserById,
};
