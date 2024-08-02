import db from "../models/index";

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ["password"],
                },
                include: [
                    {
                        model: db.Allcode,
                        as: "positionData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Allcode,
                        as: "genderData",
                        attributes: ["valueEn", "valueVi"],
                    },
                ],
                raw: true,
                nest: true, // de attributes trong inclue thanh 1 object
                where: { roleId: "R2" },
            });

            resolve({
                errCode: 0,
                data: users,
            });
        } catch (err) {
            reject(err); // neu reject thi phia Controller tu dong chay vao case "catch(err)"
        }
    });
};

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: "R2" },
                attributes: {
                    exclude: ["password", "image"],
                },
            });
            resolve({
                errCode: 0,
                data: doctors,
            });
        } catch (err) {
            reject(err); // neu reject o Promise thi controller se tu dong chay vao case "catch(err)"
        }
    });
};

let saveDetailInfoDoctor = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("input data: ", inputData);
            if (
                !inputData.doctorId ||
                !inputData.contentMarkdown ||
                !inputData.contentHTML
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "missing parameter",
                });
            } else {
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId,
                });

                resolve({
                    errCode: 0,
                    errMessage: "save doctor info succeessfuly!",
                });
            }
        } catch (err) {
            reject(err); // neu nhu loi thi se tu dong chay vao case "catch(err)" o controller goi service nay
        }
    });
};

let getDetailDoctorById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing require parameter!",
                });
            } else {
                let dataUser = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ["password"],
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: [
                                "contentHTML",
                                "contentMarkdown",
                                "description",
                            ],
                        },
                        {
                            model: db.Allcode,
                            as: "genderData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Allcode,
                            as: "positionData",
                            attributes: ["valueEn", "valueVi"],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                if (dataUser && dataUser.image) {
                    dataUser.image = new Buffer(
                        dataUser.image,
                        "base64"
                    ).toString("binary");
                }

                if (!dataUser) {
                    dataUser = {};
                }
                resolve({
                    errCode: 0,
                    data: dataUser,
                });
            }
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
    getAllDoctors: getAllDoctors,
    saveDetailInfoDoctor: saveDetailInfoDoctor,
    getDetailDoctorById: getDetailDoctorById,
};
