import { where } from "sequelize";
import db from "../models/index";
require("dotenv").config();
import _ from "lodash";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

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
            if (
                !inputData.doctorId ||
                !inputData.contentMarkdown ||
                !inputData.contentHTML ||
                !inputData.action ||
                !inputData.selectedPrice ||
                !inputData.selectedPayment ||
                !inputData.selectedProvince ||
                !inputData.nameClinic ||
                !inputData.addressClinic
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "missing parameter",
                });
            } else {
                // upsert to "Markdown table"
                if (inputData.action === "CREATE") {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    });
                } else {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false, // de no hieu la sequelize object, co the chinh sua object nay va save
                    });

                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                    }
                    await doctorMarkdown.save();
                }

                // upsert to "Doctor_Infor" table
                let doctorInfor = await db.Doctor_Infor.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false, // to get sequelize object => update directly
                });
                if (doctorInfor) {
                    // update
                    doctorInfor.priceId = inputData.selectedPrice;
                    doctorInfor.paymentId = inputData.selectedPayment;
                    doctorInfor.provinceId = inputData.selectedProvince;
                    doctorInfor.nameClinic = inputData.nameClinic;
                    doctorInfor.addressClinic = inputData.addressClinic;
                    doctorInfor.note = inputData.note;

                    await doctorInfor.save();
                } else {
                    // create
                    await db.Doctor_Infor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvince,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                    });
                }

                resolve({
                    errCode: 0,
                    errMessage: "save doctor info successfully!",
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
                            attributes: ["contentHTML", "contentMarkdown", "description"],
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
                        {
                            model: db.Doctor_Infor,
                            attributes: {
                                exclude: ["id", "doctorId"],
                            },
                            include: [
                                {
                                    model: db.Allcode,
                                    as: "priceTypeData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                                {
                                    model: db.Allcode,
                                    as: "paymentTypeData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                                {
                                    model: db.Allcode,
                                    as: "provinceTypeData",
                                    attributes: ["valueEn", "valueVi"],
                                },
                            ],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                if (dataUser && dataUser.image) {
                    dataUser.image = new Buffer(dataUser.image, "base64").toString("binary");
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

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data || !data.arrSchedule || !data.doctorId || !data.formattedDate) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                });
            }
            let schedule = data.arrSchedule;
            if (schedule && schedule.length > 0) {
                schedule = schedule.map((item) => {
                    item.maxNumber = MAX_NUMBER_SCHEDULE;
                    return item;
                });
            }

            // get existing data
            let existing = await db.Schedule.findAll({
                where: { doctorId: data.doctorId, date: data.formattedDate },
                attributes: ["timeType", "date", "doctorId", "maxNumber"],
                raw: true,
            });

            // compare to find difference => bulk create(difference)
            let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                return a.timeType === b.timeType && +a.date === +b.date;
            });

            if (toCreate && toCreate.length > 0) {
                await db.Schedule.bulkCreate(toCreate);
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

let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!",
                });
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: { doctorId: doctorId, date: date },
                    include: [
                        {
                            model: db.Allcode,
                            as: "timeTypeData",
                            attributes: ["valueEn", "valueVi"],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                if (!dataSchedule) {
                    dataSchedule = {};
                }

                resolve({ errCode: 0, data: dataSchedule });
            }
        } catch (err) {
            reject(err);
        }
    });
};

let getExtraInforDoctorById = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter!",
                });
            } else {
                let dataDoctorInfor = await db.Doctor_Infor.findOne({
                    where: {
                        doctorId: idInput,
                    },
                    attributes: {
                        exclude: ["id", "doctorId"],
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: "priceTypeData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Allcode,
                            as: "paymentTypeData",
                            attributes: ["valueEn", "valueVi"],
                        },
                        {
                            model: db.Allcode,
                            as: "provinceTypeData",
                            attributes: ["valueEn", "valueVi"],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

                if (!dataDoctorInfor) {
                    dataDoctorInfor = {};
                }

                resolve({ errCode: 0, data: dataDoctorInfor });
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
    bulkCreateSchedule: bulkCreateSchedule,
    getScheduleByDate: getScheduleByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
};
