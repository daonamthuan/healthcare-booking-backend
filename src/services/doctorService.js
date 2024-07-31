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

module.exports = {
    getTopDoctorHome: getTopDoctorHome,
};
